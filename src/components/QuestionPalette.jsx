export default function QuestionPalette({ questions, answers, currentIndex, onSelect, marked }) {
  return (
    <div className="palette">
      <h3>Question Palette</h3>
      <div className="palette-grid">
        {questions.map((q, i) => {
          const cls = [
            "palette-btn",
            i === currentIndex ? "active" : "",
            answers[q.id] !== undefined ? "answered" : "",
            marked.includes(q.id) ? "marked" : ""
          ].join(" ");
          return <button key={q.id} className={cls} onClick={() => onSelect(i)}>{i + 1}</button>;
        })}
      </div>
      <div className="legend">
        <span>● Answered</span><span>● Current</span><span>● Marked</span>
      </div>
    </div>
  );
}