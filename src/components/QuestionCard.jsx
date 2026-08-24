export default function QuestionCard({ question, index, total, selected, onAnswer }) {
  return (
    <section className="question-card">
      <div className="question-meta">
        <span>Question {index + 1} of {total}</span>
        <span>{question.subject}</span>
        <span>{question.topic}</span>
      </div>
      <h2>{question.question}</h2>
      <div className="options">
        {question.options.map((option, i) => (
          <button
            key={i}
            className={"option " + (selected === i ? "selected" : "")}
            onClick={() => onAnswer(question.id, i)}
          >
            <b>{String.fromCharCode(65 + i)}.</b> {option}
          </button>
        ))}
      </div>
    </section>
  );
}