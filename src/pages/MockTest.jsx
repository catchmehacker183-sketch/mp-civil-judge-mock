import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { questions } from "../data/questions";
import { examConfig } from "../data/syllabus";
import { buildDailyMock, getMockDistribution } from "../data/mockGenerator";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import QuestionPalette from "../components/QuestionPalette";

export default function MockTest() {
  const navigate = useNavigate();
  const submitted = useRef(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [timeLeft, setTimeLeft] = useState(examConfig.durationMinutes * 60);
  const testQuestions = useMemo(() => buildDailyMock(questions), []);
  const distribution = useMemo(() => getMockDistribution(questions), []);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !submitted.current) submitTest();
  }, [timeLeft]);

  function answerQuestion(id, option) { setAnswers(a => ({ ...a, [id]: option })); }
  function toggleMarked() {
    const id = testQuestions[current].id;
    setMarked(m => m.includes(id) ? m.filter(x => x !== id) : [...m, id]);
  }
  function submitTest() {
    if (submitted.current) return;
    submitted.current = true;
    localStorage.setItem("mpcj-result", JSON.stringify({ answers, marked, timeLeft, questions: testQuestions, distribution, date: new Date().toISOString().slice(0, 10) }));
    navigate("/result");
  }

  const q = testQuestions[current];
  return (
    <main className="test-page">
      <header className="test-header">
        <div>
          <div className="badge">MP CIVIL JUDGE PRELIMS</div>
          <h1>Today's 150-Question Mock</h1>
          <p>110 Law • 20 GK • 10 Computer • 10 English</p>
        </div>
        <Timer seconds={timeLeft} />
      </header>
      <div className="test-layout">
        <div>
          <QuestionCard question={q} index={current} total={testQuestions.length} selected={answers[q.id]} onAnswer={answerQuestion} />
          <div className="controls">
            <button onClick={() => setCurrent(i => Math.max(0, i - 1))}>← Previous</button>
            <button onClick={toggleMarked}>{marked.includes(q.id) ? "Unmark Review" : "Mark for Review"}</button>
            {current < testQuestions.length - 1 ? <button className="primary" onClick={() => setCurrent(i => i + 1)}>Next →</button> : <button className="primary" onClick={submitTest}>Submit Test</button>}
          </div>
        </div>
        <QuestionPalette questions={testQuestions} answers={answers} currentIndex={current} onSelect={setCurrent} marked={marked} />
      </div>
    </main>
  );
}
