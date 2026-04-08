import { useEffect, useState } from "react";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import { addMonths, subMonths, format } from "date-fns";
import "./Calender.css";

function getMonthStorageKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `month:${year}-${month}`;
}

export default function Calendar() {
  const today = new Date();
  const FLIP_DURATION_MS = 900;

  const [displayedMonth, setDisplayedMonth] = useState(today);
  const [incomingMonth, setIncomingMonth] = useState(null);
  const [flipDirection, setFlipDirection] = useState("next");
  const [isFlipping, setIsFlipping] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isMonthNoteOpen, setIsMonthNoteOpen] = useState(false);
  const [monthNoteText, setMonthNoteText] = useState(
    localStorage.getItem(getMonthStorageKey(today)) || ""
  );

  const currentMonthKey = getMonthStorageKey(displayedMonth);
  const currentMonthNote = monthNoteText;
  
  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      
      setEndDate(null);
    } else {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const changeMonth = (direction) => {
    if (isFlipping) return;

    const nextMonth =
      direction === "next"
        ? addMonths(displayedMonth, 1)
        : subMonths(displayedMonth, 1);

    setIncomingMonth(nextMonth);
    setFlipDirection(direction);
    setIsFlipping(true);

    window.setTimeout(() => {
      setDisplayedMonth(nextMonth);
      setIncomingMonth(null);
      setIsFlipping(false);
    }, FLIP_DURATION_MS);
  };

  const syncMonthNote = (monthDate) => {
    const key = getMonthStorageKey(monthDate);
    setMonthNoteText(localStorage.getItem(key) || "");
  };

  useEffect(() => {
    syncMonthNote(displayedMonth);
  }, [displayedMonth]);

  useEffect(() => {
    if (!isMonthNoteOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMonthNoteOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMonthNoteOpen]);

  return (
    <div className="container">
      <div className="header">
  <button className="nav-btn" onClick={() => changeMonth("prev")} disabled={isFlipping}>
    ←
  </button>

  <div className="month-title-wrap">
    <h2
      key={format(isFlipping && incomingMonth ? incomingMonth : displayedMonth, "yyyy-MM")}
      className={`month-title ${flipDirection}`}
    >
      {format(isFlipping && incomingMonth ? incomingMonth : displayedMonth, "MMMM yyyy")}
    </h2>

    <button
      className={`month-note-toggle ${currentMonthNote ? "has-note" : ""}`}
      type="button"
        onClick={() => {
          syncMonthNote(displayedMonth);
          setIsMonthNoteOpen((prev) => !prev);
        }}
      aria-label="Open monthly notes"
      title="Monthly note"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M8 3H7C5.34315 3 4 4.34315 4 6V17C4 18.6569 5.34315 20 7 20H18C19.6569 20 21 18.6569 21 17V16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 3.5L20.5 6.5L12 15H9V12L17.5 3.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  </div>

  <button className="nav-btn" onClick={() => changeMonth("next")} disabled={isFlipping}>
    →
  </button>
</div>

      {isMonthNoteOpen && (
        <div
          className="month-note-modal-overlay"
          onClick={() => setIsMonthNoteOpen(false)}
        >
          <div
            className="month-note-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Monthly notes"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="month-note-modal-head">
              <p className="month-note-title">
                Monthly Note: {format(displayedMonth, "MMMM yyyy")}
              </p>
              <button
                type="button"
                className="month-note-close"
                onClick={() => setIsMonthNoteOpen(false)}
                aria-label="Close monthly notes"
              >
                ×
              </button>
            </div>

            <textarea
              value={currentMonthNote}
              onChange={(e) => {
                const nextValue = e.target.value;
                setMonthNoteText(nextValue);
                localStorage.setItem(currentMonthKey, nextValue);
              }}
              placeholder="Write note for this month..."
            />
          </div>
        </div>
      )}

      {/* Wall Layout */}
      <div className="layout">

        {/* Image Section */}
        <div className="imageBox">
          <img
            src="https://picsum.photos/400/300"
            alt="calendar"
          />
        </div>

        {/* Calendar + Notes */}
        <div>
          <div className={`calendar-wrapper ${isFlipping ? `is-flipping ${flipDirection}` : ""}`}>
            {isFlipping && incomingMonth && (
              <div className="calendar-sheet under-sheet">
                <CalendarGrid
                  currentMonth={incomingMonth}
                  onDateClick={handleDateClick}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            )}

            <div className={`calendar-sheet ${isFlipping ? "flipping-sheet" : "current-sheet"}`}>
  <div className="page-face front">
    <CalendarGrid
      currentMonth={displayedMonth}
      onDateClick={handleDateClick}
      startDate={startDate}
      endDate={endDate}
    />
  </div>

  {isFlipping && incomingMonth && (
    <div className="page-face back">
      <CalendarGrid
        currentMonth={incomingMonth}
        onDateClick={handleDateClick}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  )}
</div>
          </div>
          

          <NotesPanel
            startDate={startDate}
            endDate={endDate}
          />
        </div>

      </div>
    </div>
  );
}