export default function DayCell({
  date,
  onClick,
  startDate,
  endDate,
}) {
  if (!date) return <div className="cell empty" />;

  const isStart =
    startDate && date.toDateString() === startDate.toDateString();

  const isEnd =
    endDate && date.toDateString() === endDate.toDateString();

  const isInRange =
    startDate &&
    endDate &&
    date > startDate &&
    date < endDate;

  const dayOfWeek = date.getDay();

  const isAwaitingEnd = startDate && !endDate;

  let className = "cell";

  if (isStart) className += " start";
  else if (isEnd) className += " end";
  else if (isInRange) className += " range";

  if (dayOfWeek === 0) className += " sun";
  else if (dayOfWeek === 6) className += " sat";

  if (isStart && isAwaitingEnd) className += " pending-end";

  return (
    <div className={className} onClick={() => onClick(date)}>
      {date.getDate()}
    </div>
  );
}