import { useState, useEffect } from "react";

export default function NotesPanel({ startDate, endDate }) {
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("note");
    if (saved) setNote(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("note", note);
  }, [note]);

  return (
    <div className="notes">
      <h3>Notes</h3>

      {startDate && endDate && (
        <p>
          {startDate.toDateString()} → {endDate.toDateString()}
        </p>
      )}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write notes..."
      />
    </div>
  );
}