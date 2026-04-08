import { useState } from "react";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import { addMonths, subMonths, format } from "date-fns";
import "./Calender.css";

export default function Calendar() {
  const today = new Date();
  const FLIP_DURATION_MS = 900;

  const [displayedMonth, setDisplayedMonth] = useState(today);
  const [incomingMonth, setIncomingMonth] = useState(null);
  const [flipDirection, setFlipDirection] = useState("next");
  const [isFlipping, setIsFlipping] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
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

  return (
    <div className="container">
      <div className="header">
  <button onClick={() => changeMonth("prev")} disabled={isFlipping}>
    ←
  </button>

  <h2
    key={format(isFlipping && incomingMonth ? incomingMonth : displayedMonth, "yyyy-MM")}
    className={`month-title ${flipDirection}`}
  >
    {format(isFlipping && incomingMonth ? incomingMonth : displayedMonth, "MMMM yyyy")}
  </h2>

  <button onClick={() => changeMonth("next")} disabled={isFlipping}>
    →
  </button>
</div>
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
          

          <NotesPanel startDate={startDate} endDate={endDate} />
        </div>

      </div>
    </div>
  );
}