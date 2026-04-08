import { useState, useEffect, useMemo } from "react";

function formatDateKey(date) {
  return date.toISOString().split("T")[0];
}

export default function NotesPanel({ startDate, endDate }) {
  const [rangeNote, setRangeNote] = useState("");

  const rangeKey = useMemo(() => {
    if (!startDate || !endDate) return null;
    return `range:${formatDateKey(startDate)}_${formatDateKey(endDate)}`;
  }, [startDate, endDate]);

  useEffect(() => {
    if (!rangeKey) {
      setRangeNote("");
      return;
    }

    const saved = localStorage.getItem(rangeKey);
    setRangeNote(saved || "");
  }, [rangeKey]);

  useEffect(() => {
    if (!rangeKey) return;
    localStorage.setItem(rangeKey, rangeNote);
  }, [rangeKey, rangeNote]);

  return (
    <div className="notes">
      <h3>Notes</h3>

      <div className="note-section">
        <p className="note-section-title">Date Range Note</p>

        {startDate && endDate ? (
          <p>
            {startDate.toDateString()} → {endDate.toDateString()}
          </p>
        ) : (
          <p>Select both start and end date to write a range note.</p>
        )}

        <textarea
          value={rangeNote}
          onChange={(e) => setRangeNote(e.target.value)}
          placeholder="Write notes for selected date range..."
          disabled={!rangeKey}
        />
      </div>
    </div>
  );
}