import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { examConfig } from "../data/syllabus";

export default function Result() {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("mpcj-result") || "null");

  if (!data) {
    return (
      <main className="home">
        <h1>No result found.</h1>
        <button className="primary" onClick={() => navigate("/")}>Go Home</button>
      </main>
    );
  }

  const { answers, questions, timeLeft } = data;

  const stats = useMemo(() => {
    let correct = 0, wrong = 0, unanswered = 0;
    questions.forEach(q => {
      if (answers[q.id] === undefined) unanswered++;
      else if (answers[q.id] === q.correctAnswer) correct++;
      else wrong++;
    });
    return { correct, wrong, unanswered };
  }, [answers, questions]);

  const score = stats.correct;
  const accuracy = questions.length - stats.unanswered
    ? ((stats.correct / (stats.correct + stats.wrong)) * 100).toFixed(2)
    : "0.00";

  const timeTaken = Math.max(0, examConfig.durationMinutes * 60 - timeLeft);

  const subjectStats = useMemo(() => {
    const map = {};
    questions.forEach(q => {
      if (!map[q.subject]) map[q.subject] = { subject: q.subject, total: 0, correct: 0, wrong: 0, unanswered: 0 };
      map[q.subject].total += 1;
      if (answers[q.id] === undefined) map[q.subject].unanswered += 1;
      else if (answers[q.id] === q.correctAnswer) map[q.subject].correct += 1;
      else map[q.subject].wrong += 1;
    });
    return Object.values(map);
  }, [answers, questions]);

  function downloadPdf() {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const left = 15;
    const right = 15;
    const contentWidth = pageWidth - left - right;
    let y = 18;

    const addNewPageIfNeeded = (needed = 12) => {
      if (y + needed > pageHeight - 15) {
        doc.addPage();
        y = 18;
      }
    };

    const writeWrapped = (text, size = 11, lineGap = 6) => {
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(String(text), contentWidth);
      lines.forEach(line => {
        addNewPageIfNeeded(lineGap);
        doc.text(line, left, y);
        y += lineGap;
      });
    };

    // Summary
    doc.setFontSize(20);
    doc.text("MP CIVIL JUDGE PRELIMS", left, y);
    y += 10;

    doc.setFontSize(15);
    doc.text("Mock Test Result", left, y);
    y += 12;

    doc.setDrawColor(180);
    doc.line(left, y, pageWidth - right, y);
    y += 10;

    writeWrapped(`Score: ${score} / ${questions.length}`, 12, 7);
    writeWrapped(`Correct: ${stats.correct}`, 12, 7);
    writeWrapped(`Wrong: ${stats.wrong}`, 12, 7);
    writeWrapped(`Unattempted: ${stats.unanswered}`, 12, 7);
    writeWrapped(`Accuracy: ${accuracy}%`, 12, 7);
    writeWrapped(`Time taken: ${Math.floor(timeTaken / 60)} minutes ${timeTaken % 60} seconds`, 12, 7);

    y += 5;
    addNewPageIfNeeded(25);
    doc.setFontSize(14);
    doc.text("SUBJECT-WISE PERFORMANCE", left, y);
    y += 8;
    subjectStats.forEach(s => {
      writeWrapped(`${s.subject}: ${s.correct}/${s.total} correct | Wrong ${s.wrong} | Unattempted ${s.unanswered}`, 10.5, 5.5);
    });

    y += 8;
    addNewPageIfNeeded(20);

    doc.setFontSize(17);
    doc.text("ANSWER REVIEW", left, y);
    y += 10;

    // Complete answer review
    questions.forEach((q, i) => {
      addNewPageIfNeeded(45);

      doc.setDrawColor(210);
      doc.line(left, y, pageWidth - right, y);
      y += 8;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      writeWrapped(`Question ${i + 1}`, 12, 7);
      doc.setFont("helvetica", "normal");

      writeWrapped(q.question, 11, 6);
      y += 2;

      q.options.forEach((option, optionIndex) => {
        const label = `${String.fromCharCode(65 + optionIndex)}. ${option}`;
        writeWrapped(label, 10.5, 5.5);
      });

      y += 3;

      const selected = answers[q.id];

      doc.setFont("helvetica", "bold");
      writeWrapped(
        `Your Answer: ${
          selected === undefined
            ? "Not Answered"
            : `${String.fromCharCode(65 + selected)}. ${q.options[selected]}`
        }`,
        11,
        6
      );

      writeWrapped(
        `Correct Answer: ${String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}`,
        11,
        6
      );

      doc.setFont("helvetica", "normal");
      y += 2;

      doc.setFont("helvetica", "bold");
      writeWrapped("Explanation:", 11, 6);
      doc.setFont("helvetica", "normal");
      writeWrapped(q.explanation || "No explanation available.", 10.5, 5.5);

      if (q.reference) {
        doc.setFont("helvetica", "italic");
        writeWrapped(`Reference: ${q.reference}`, 10, 5.5);
        doc.setFont("helvetica", "normal");
      }

      y += 8;
    });

    const date = new Date().toLocaleDateString("en-IN").replaceAll("/", "-");
    doc.save(`MP-Civil-Judge-Mock-Result-${date}.pdf`);
  }

  return (
    <main className="result-page">
      <section className="result-hero">
        <div className="badge">TEST COMPLETED</div>
        <h1>{score} / {questions.length}</h1>
        <p>Your score</p>
        <div className="result-grid">
          <div><strong>{stats.correct}</strong><span>Correct</span></div>
          <div><strong>{stats.wrong}</strong><span>Wrong</span></div>
          <div><strong>{stats.unanswered}</strong><span>Unattempted</span></div>
          <div><strong>{accuracy}%</strong><span>Accuracy</span></div>
        </div>
        <div className="controls center">
          <button onClick={() => navigate("/")}>Home</button>
          <button className="primary" onClick={downloadPdf}>Download PDF with Answer Review</button>
        </div>
      </section>

      <section className="review">
        <h2>Subject-Wise Performance</h2>
        <div className="subject-grid">
          {subjectStats.map(s => (
            <article className="subject-card" key={s.subject}>
              <h3>{s.subject}</h3>
              <strong>{s.correct} / {s.total}</strong>
              <span>Correct • Wrong {s.wrong} • Unattempted {s.unanswered}</span>
            </article>
          ))}
        </div>

        <h2>Answer Review</h2>
        {questions.map((q, i) => {
          const selected = answers[q.id];
          const ok = selected === q.correctAnswer;
          return (
            <article className="review-card" key={q.id}>
              <div className="review-number">Question {i + 1}</div>
              <h3>{q.question}</h3>
              <p>Your answer: <b>{selected === undefined ? "Not answered" : `${String.fromCharCode(65 + selected)}. ${q.options[selected]}`}</b></p>
              <p className={ok ? "correct" : "wrong"}>{ok ? "Correct" : "Incorrect"}</p>
              <p>Correct answer: <b>{String.fromCharCode(65 + q.correctAnswer)}. {q.options[q.correctAnswer]}</b></p>
              <p><b>Explanation:</b> {q.explanation}</p>
              <p className="reference">{q.reference}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}