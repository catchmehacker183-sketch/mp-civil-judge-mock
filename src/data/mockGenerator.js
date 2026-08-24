import { syllabus, examConfig } from "./syllabus";

function hashString(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function chooseWeightedIndex(items, random) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = random() * total;
  for (let i = 0; i < items.length; i++) {
    cursor -= items[i].weight;
    if (cursor <= 0) return i;
  }
  return items.length - 1;
}

export function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function buildLawQuota(allQuestions, date = new Date()) {
  const lawSubjects = syllabus.filter(s => s.category === "law");
  const pools = Object.fromEntries(lawSubjects.map(s => [
    s.id,
    allQuestions.filter(q => q.subject === s.name)
  ]));

  const random = seededRandom(hashString(`${getDateKey(date)}-law-quota-v2`));
  const quota = {};
  let total = 0;

  // Start from minimums, constrained by what is actually available.
  lawSubjects.forEach(subject => {
    const available = pools[subject.id].length;
    const min = Math.min(subject.min, available);
    if (available < subject.min) {
      throw new Error(`${subject.name} has only ${available} questions; minimum required for this mock profile is ${subject.min}.`);
    }
    quota[subject.id] = min;
    total += min;
  });

  if (total > examConfig.lawQuestions) {
    throw new Error("Law minimums exceed the 110-question law target.");
  }

  // Fill remaining law slots using weighted randomness, respecting max and bank size.
  while (total < examConfig.lawQuestions) {
    const eligible = lawSubjects
      .map(subject => ({
        subject,
        available: pools[subject.id].length,
        capacity: Math.min(subject.max, pools[subject.id].length) - quota[subject.id],
        weight: subject.weight
      }))
      .filter(item => item.capacity > 0);

    if (!eligible.length) {
      throw new Error(`Question bank cannot supply ${examConfig.lawQuestions} law questions under the current profile.`);
    }

    const chosen = eligible[chooseWeightedIndex(eligible, random)];
    quota[chosen.subject.id] += 1;
    total += 1;
  }

  return quota;
}

function selectFixedSection(allQuestions, subject, count, random) {
  const pool = allQuestions.filter(q => q.subject === subject.name);
  if (pool.length < count) {
    throw new Error(`${subject.name}: needs ${count}, has ${pool.length}.`);
  }
  return shuffle(pool, random).slice(0, count);
}

export function buildDailyMock(allQuestions, date = new Date()) {
  const dateKey = getDateKey(date);
  const lawSubjects = syllabus.filter(s => s.category === "law");
  const quota = buildLawQuota(allQuestions, date);
  const selected = [];

  lawSubjects.forEach((subject, index) => {
    const pool = allQuestions.filter(q => q.subject === subject.name);
    const random = seededRandom(hashString(`${dateKey}-${subject.id}-${index}`));
    selected.push(...shuffle(pool, random).slice(0, quota[subject.id]));
  });

  syllabus.filter(s => s.fixed).forEach((subject, index) => {
    selected.push(...selectFixedSection(
      allQuestions,
      subject,
      subject.fixed,
      seededRandom(hashString(`${dateKey}-${subject.id}-fixed-${index}`))
    ));
  });

  if (selected.length !== examConfig.totalQuestions) {
    throw new Error(`Mock construction failed: expected ${examConfig.totalQuestions}, got ${selected.length}.`);
  }

  const unique = new Set(selected.map(q => q.id));
  if (unique.size !== selected.length) {
    throw new Error("Duplicate question detected while building the mock.");
  }

  return shuffle(selected, seededRandom(hashString(`${dateKey}-final-order-v2`)));
}

export function getMockDistribution(allQuestions, date = new Date()) {
  const lawQuota = buildLawQuota(allQuestions, date);
  return syllabus.map(subject => ({
    id: subject.id,
    name: subject.name,
    count: subject.category === "law" ? lawQuota[subject.id] : subject.fixed,
    category: subject.category
  }));
}

export function getBankStats(allQuestions) {
  return syllabus.map(subject => ({
    ...subject,
    available: allQuestions.filter(q => q.subject === subject.name).length
  }));
}
