import { useNavigate } from "react-router-dom";
import { examConfig, syllabus } from "../data/syllabus";
import { questions } from "../data/questions";
import { getMockDistribution } from "../data/mockGenerator";

export default function Home() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const distribution = getMockDistribution(questions);
  const law = distribution.filter(x => x.category === "law");

  return (
    <main className="home">
      <section className="hero">
        <div className="badge">MP CIVIL JUDGE PRELIMS</div>
        <h1>150-question mock tests built around the actual paper structure.</h1>
        <p>110 Law • 20 General Knowledge • 10 Computer • 10 English • 120 Minutes</p>
        <button className="primary" onClick={() => navigate("/mock")}>Start Today's Mock</button>
        <div className="today">{today}</div>
      </section>

      <section className="stats">
        <div><strong>{examConfig.totalQuestions}</strong><span>Questions per mock</span></div>
        <div><strong>{examConfig.lawQuestions}</strong><span>Law questions</span></div>
        <div><strong>{examConfig.durationMinutes}</strong><span>Minutes</span></div>
        <div><strong>{questions.length}</strong><span>Current bank items</span></div>
      </section>

      <section className="subjects">
        <h2>Today's Law Distribution</h2>
        <p>The 110 law questions are allocated with weighted randomness within subject limits, then all 150 questions are globally shuffled.</p>
        <div className="subject-grid">
          {law.map(s => (
            <article key={s.id} className="subject-card">
              <h3>{s.name}</h3>
              <strong>{s.count}</strong>
              <span>today's questions</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
