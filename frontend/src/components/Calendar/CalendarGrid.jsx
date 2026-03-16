import { useState } from "react";
import dayjs from "dayjs";

function CalendarGrid({ events = [], onEventClick }) {

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const today = dayjs();

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  let date = startDate.clone();
  const calendarDays = [];

  while (date.isBefore(endDate) || date.isSame(endDate, "day")) {
    calendarDays.push(date);
    date = date.add(1, "day");
  }

  const prevMonth = () => {
    setCurrentMonth(prev => prev.subtract(1, "month"));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => prev.add(1, "month"));
  };

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-4">

          <button
            onClick={prevMonth}
            className="bg-slate-700 px-3 py-1 rounded hover:bg-slate-600"
          >
            ◀
          </button>

          <h2 className="text-2xl font-bold">
            {currentMonth.format("MMMM YYYY")}
          </h2>

          <button
            onClick={nextMonth}
            className="bg-slate-700 px-3 py-1 rounded hover:bg-slate-600"
          >
            ▶
          </button>

        </div>

      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-center mb-2 text-slate-400">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">

        {calendarDays.map((dateItem, index) => {

          const isToday = dateItem.isSame(today, "day");
          const isCurrentMonth =
            dateItem.month() === currentMonth.month();

          const dayEvents = events.filter(
            (event) =>
              event.date === dateItem.format("YYYY-MM-DD")
          );

          const cellColor = dayEvents.length > 0 ? dayEvents[0].color : null;

          return (
            <div
              key={index}
              className={`h-32 border rounded p-2 border-slate-700 flex flex-col
                ${isToday ? "bg-blue-500 text-white" : "bg-slate-800"}
                ${!isCurrentMonth ? "text-slate-500" : "text-white"}
              `}
              style={
                cellColor
                  ? { borderTopColor: cellColor, borderTopWidth: "4px" }
                  : {}
              }
            >

              {/* Date */}
              <div
                className="text-sm font-semibold"
                style={cellColor ? { color: cellColor } : {}}
              >
                {dateItem.date()}
              </div>

              {/* Event color dots */}
              {dayEvents.length > 0 && (
                <div className="flex gap-1 mt-1 flex-shrink-0">
                  {dayEvents.map((e, idx) => (
                    <span
                      key={idx}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: e.color }}
                    />
                  ))}
                </div>
              )}

              {/* Scrollable Events */}
              <div className="mt-1 flex flex-col gap-1 text-xs overflow-y-auto flex-1 pr-1">

                {dayEvents.map((event, i) => (
                  <div
                    key={i}
                    onClick={() => onEventClick && onEventClick(event)}
                    className="px-1 rounded truncate cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: event.color, color: "#fff" }}
                  >
                    {event.title}
                  </div>
                ))}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default CalendarGrid;