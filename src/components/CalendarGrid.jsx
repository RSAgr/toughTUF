import DayCell from "./DayCell";

export default function CalendarGrid({
  currentMonth,
  onDateClick,
  startDate,
  endDate,
}) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const selectionHint = !startDate
    ? "Select a start date"
    : !endDate
      ? "Start selected. Now pick an end date"
      : "Date range selected. Click any date to start again";
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  while (days.length < 42) {
    days.push(null);
  }

  return (
    <div className="calendar-grid-wrap">
      <p
        className={`selection-hint ${startDate && !endDate ? "awaiting-end" : ""}`}
        aria-live="polite"
      >
        {selectionHint}
      </p>

      <div className="weekday-row">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={`weekday-cell ${index === 0 ? "sun" : ""} ${index === 6 ? "sat" : ""}`.trim()}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid">
        {days.map((date, index) => (
          <DayCell
            key={index}
            date={date}
            onClick={onDateClick}
            startDate={startDate}
            endDate={endDate}
          />
        ))}
      </div>
    </div>
  );
}