import DayCell from "./DayCell";

export default function CalendarGrid({
  currentMonth,
  onDateClick,
  startDate,
  endDate,
}) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

  return (
    <div className="calendar-grid-wrap">
      <div className="weekday-row">
        {weekdays.map((day) => (
          <div key={day} className="weekday-cell">
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