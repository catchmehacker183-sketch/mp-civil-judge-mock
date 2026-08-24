export const syllabus = [
  { id: "constitution", name: "Constitution of India", category: "law", min: 6, max: 14, weight: 1.0 },
  { id: "cpc", name: "Code of Civil Procedure, 1908", category: "law", min: 12, max: 22, weight: 1.8 },
  { id: "tpa", name: "Transfer of Property Act, 1882", category: "law", min: 5, max: 11, weight: 0.9 },
  { id: "specificRelief", name: "Specific Relief Act, 1963", category: "law", min: 5, max: 11, weight: 1.0 },
  { id: "limitation", name: "Limitation Act, 1963", category: "law", min: 4, max: 9, weight: 0.7 },
  { id: "mpAccommodation", name: "Madhya Pradesh Accommodation Control Act, 1961", category: "law", min: 3, max: 7, weight: 0.5 },
  { id: "mpLandRevenue", name: "Madhya Pradesh Land Revenue Code, 1959", category: "law", min: 4, max: 9, weight: 0.7 },
  { id: "bsa", name: "Bharatiya Sakshya Adhiniyam, 2023", category: "law", min: 6, max: 12, weight: 1.0 },
  { id: "bns", name: "Bharatiya Nyaya Sanhita, 2023", category: "law", min: 15, max: 28, weight: 2.2 },
  { id: "bnss", name: "Bharatiya Nagarik Suraksha Sanhita, 2023", category: "law", min: 15, max: 26, weight: 2.0 },
  { id: "niAct", name: "Negotiable Instruments Act, 1881", category: "law", min: 4, max: 10, weight: 0.8 },
  { id: "generalKnowledge", name: "General Knowledge", category: "generalKnowledge", fixed: 20 },
  { id: "computer", name: "Computer Knowledge", category: "computer", fixed: 10 },
  { id: "english", name: "English Knowledge", category: "english", fixed: 10 }
];

export const examConfig = {
  name: "Madhya Pradesh Civil Judge Prelims",
  totalQuestions: 150,
  lawQuestions: 110,
  generalKnowledgeQuestions: 20,
  computerQuestions: 10,
  englishQuestions: 10,
  durationMinutes: 120,
  negativeMark: 0,
  bankTarget: 6000
};
