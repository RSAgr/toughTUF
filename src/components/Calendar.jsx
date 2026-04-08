import { useEffect, useMemo, useRef, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isMonthNoteOpen, setIsMonthNoteOpen] = useState(false);
  const [monthNoteText, setMonthNoteText] = useState(
    localStorage.getItem(getMonthStorageKey(today)) || ""
  );

  const currentMonthKey = getMonthStorageKey(displayedMonth);
  const currentMonthNote = monthNoteText;
  const displayForLabel = isFlipping && incomingMonth ? incomingMonth : displayedMonth;
  const DRAG_DISTANCE_THRESHOLD = 75;
  const SWIPE_VELOCITY_THRESHOLD = 0.55;
  const dragStartXRef = useRef(0);
  const lastDragXRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const didDragRef = useRef(false);

  const dragIncomingMonth = useMemo(() => {
    if (!isDragging || dragOffsetX === 0) return null;
    return dragOffsetX < 0
      ? addMonths(displayedMonth, 1)
      : subMonths(displayedMonth, 1);
  }, [displayedMonth, isDragging, dragOffsetX]);

  const renderCalendarPage = (monthDate) => (
    <div className="layout">
      <div className="imageBox">
        <img
          src="https://picsum.photos/400/300"
          alt="calendar"
        />

        <div className="hero-month-badge">
          <span className="hero-year">{format(monthDate, "yyyy")}</span>
          <span className="hero-month">{format(monthDate, "MMMM")}</span>
        </div>
      </div>

      <div className="paper-body">
        <div className="notes-column">
          <NotesPanel
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        <div className="dates-column">
          <CalendarGrid
            currentMonth={monthDate}
            onDateClick={handleDateClick}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    </div>
  );
  
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
      setMonthNoteText(readMonthNote(nextMonth));
      setIncomingMonth(null);
      setIsFlipping(false);
    }, FLIP_DURATION_MS);
  };

  const readMonthNote = (monthDate) => {
    const key = getMonthStorageKey(monthDate);
    return localStorage.getItem(key) || "";
  };

  const beginDrag = (x) => {
    if (isFlipping || isMonthNoteOpen) return;
    const now = performance.now();
    dragStartXRef.current = x;
    lastDragXRef.current = x;
    lastDragTimeRef.current = now;
    dragVelocityRef.current = 0;
    didDragRef.current = false;
    setDragOffsetX(0);
    setIsDragging(true);
  };

  const updateDrag = (x) => {
    if (!isDragging) return;

    const now = performance.now();
    const deltaX = x - lastDragXRef.current;
    const deltaT = now - lastDragTimeRef.current;

    if (deltaT > 0) {
      dragVelocityRef.current = deltaX / deltaT;
    }

    lastDragXRef.current = x;
    lastDragTimeRef.current = now;

    const rawDelta = x - dragStartXRef.current;
    const clampedDelta = Math.max(-170, Math.min(170, rawDelta));

    if (Math.abs(clampedDelta) > 8) {
      didDragRef.current = true;
    }

    setDragOffsetX(clampedDelta);
  };

  const endDrag = () => {
    if (!isDragging) return;

    const finalOffset = dragOffsetX;
    const finalVelocity = dragVelocityRef.current;
    setIsDragging(false);
    setDragOffsetX(0);

    const crossedDistance = Math.abs(finalOffset) > DRAG_DISTANCE_THRESHOLD;
    const crossedVelocity = Math.abs(finalVelocity) > SWIPE_VELOCITY_THRESHOLD;

    if (crossedDistance || crossedVelocity) {
      const directionSource = crossedDistance ? finalOffset : finalVelocity;
      changeMonth(directionSource < 0 ? "next" : "prev");
    }
  };


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

  const dragRotation = Math.max(-14, Math.min(14, dragOffsetX / 10));
  const dragShift = dragOffsetX * 0.18;
  const dragDirectionClass = dragOffsetX < 0 ? "drag-next" : "drag-prev";

  return (
    <div className="container">
      <div className="header">
  <button
    className="nav-btn"
    onClick={() => changeMonth("prev")}
    disabled={isFlipping}
    aria-label="Previous month"
  >
    <span className="nav-arrow" aria-hidden="true">←</span>
    <span className="nav-hint" aria-hidden="true">MONTH--</span>
  </button>

  <div className="month-title-wrap">
    <h2
      key={format(displayForLabel, "yyyy-MM")}
      className={`month-title ${flipDirection}`}
    >
      {format(displayForLabel, "MMMM yyyy")}
    </h2>

    <button
      className={`month-note-toggle ${currentMonthNote ? "has-note" : ""}`}
      type="button"
        onClick={() => {
          setMonthNoteText(readMonthNote(displayedMonth));
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

  <button
    className="nav-btn"
    onClick={() => changeMonth("next")}
    disabled={isFlipping}
    aria-label="Next month"
  >
    <span className="nav-arrow" aria-hidden="true">→</span>
    <span className="nav-hint" aria-hidden="true">MONTH++</span>
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

      <div className="calendar-board">
        <div
          className={`sheet-stage ${isFlipping ? `is-flipping ${flipDirection}` : ""} ${isDragging ? "is-dragging" : ""}`}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            const target = event.target;
            if (
              target instanceof Element &&
              target.closest("button, textarea, input, select, a, .cell, .grid, .weekday-row, .selection-hint")
            ) {
              return;
            }
            event.currentTarget.setPointerCapture?.(event.pointerId);
            beginDrag(event.clientX);
          }}
          onPointerMove={(event) => updateDrag(event.clientX)}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={(event) => {
            if (didDragRef.current) {
              event.preventDefault();
              event.stopPropagation();
              didDragRef.current = false;
            }
          }}
        >
          {(isFlipping && incomingMonth) || (isDragging && dragIncomingMonth) ? (
            <div className="sheet-layer under-layer">
              {renderCalendarPage(incomingMonth || dragIncomingMonth)}
            </div>
          ) : null}

          <div
            className={`sheet-layer top-layer ${isFlipping ? "flipping-layer" : ""} ${isDragging ? dragDirectionClass : ""}`}
            style={
              isDragging && !isFlipping
                ? { transform: `translateX(${dragShift}px) rotateY(${dragRotation}deg)` }
                : undefined
            }
          >
            {renderCalendarPage(displayedMonth)}
          </div>
        </div>

        <aside className="motivation-card">
          <p className="motivation-quote-mark">"</p>
          <p className="motivation-quote">
            Consistency beats intensity. Solve one problem every day and let compound growth do the rest.
          </p>
          <p className="motivation-author">- Striver</p>
          <img src="/striver.jpeg" alt="Striver" className="motivation-image" />
        </aside>
      </div>
    </div>
  );
}