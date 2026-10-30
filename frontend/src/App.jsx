/** @format */

import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flippedId, setFlippedId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/flashcards")
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
  }, []);

  const generateFlashcards = () => {
    setLoading(true);
    setError(""); // clear any old error when starting

    fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to generate"); // if backend sent an error status, trigger catch
        }
        return res.json();
      })
      .then((data) => {
        setFlashcards([...flashcards, ...data]);
        setText("");
        setLoading(false);
      })
      .catch((err) => {
        setError(
          "Something went wrong. The AI might be busy — please try again.",
        );
        setLoading(false);
      });
  };

  const deleteFlashcards = (id) => {
    fetch(`http://localhost:3000/flashcards/${id}`, {
      method: "DELETE",
    }).then(() => {
      setFlashcards(flashcards.filter((flashcard) => flashcard._id !== id));
    });
  };

  return (
    <div className="container">
      <h1>Generate Flashcards</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your test here..."
      />
      <button onClick={generateFlashcards} disabled={loading}>
        {loading ? "Generating..." : "Generate Flashcards"}
      </button>
      {error && <p className="error">{error}</p>}
      <div className="flashcards">
        {flashcards.map((card) => (
          <div
            className="card"
            key={card._id}
            onClick={() =>
              setFlippedId(flippedId === card._id ? null : card._id)
            }
          >
            <p className="question">{card.question}</p>
            {flippedId === card._id && <p className="answer">{card.answer}</p>}
            <button
              className="dlt_btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteFlashcards(card._id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
