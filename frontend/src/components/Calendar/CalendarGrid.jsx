import { useState } from "react";
import dayjs from "dayjs";

function CalendarGrid({ events = [], onEventClick }) {

  const [currentWeek, setCurrentWeek] = useState(dayjs().startOf('week'));

  const today = dayjs();

  // Generate time slots from 6 AM to 11 PM
  const timeSlots = [];
  for (let hour = 6; hour <= 23; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Get the 7 days of the current week
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(currentWeek.add(i, 'day'));
  }

  const prevWeek = () => {
    setCurrentWeek(prev => prev.subtract(1, 'week'));
  };

  const nextWeek = () => {
    setCurrentWeek(prev => prev.add(1, 'week'));
  };

  const getEventsForDayAndTime = (date, timeSlot) => {
    return events.filter(event => {
      const eventDate = dayjs(event.date);
      const eventTime = event.time.substring(0, 2); // Get hour from time
      const slotHour = timeSlot.substring(0, 2);

      return eventDate.isSame(date, 'day') && eventTime === slotHour;
    });
  };

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-4">

          <button
            onClick={prevWeek}
            className="bg-slate-700 px-3 py-1 rounded hover:bg-slate-600"
          >
            ◀
          </button>

          <h2 className="text-2xl font-bold">
            Week of {currentWeek.format("MMM D, YYYY")}
          </h2>

          <button
            onClick={nextWeek}
            className="bg-slate-700 px-3 py-1 rounded hover:bg-slate-600"
          >
            ▶
          </button>

        </div>

      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-8 gap-2 mb-2">
        <div className="text-center text-slate-400">Time</div>
        {weekDays.map((date, index) => {
          const isToday = date.isSame(today, "day");
          return (
            <div key={index} className={`text-center text-sm font-semibold ${isToday ? 'text-blue-400' : 'text-slate-400'}`}>
              {date.format("ddd D")}
            </div>
          );
        })}
      </div>

      {/* Timetable Grid */}
      <div className="border border-slate-700 rounded overflow-hidden">
        {timeSlots.map((timeSlot, timeIndex) => (
          <div key={timeIndex} className="grid grid-cols-8 gap-2 border-b border-slate-700 last:border-b-0">
            {/* Time Column */}
            <div className="bg-slate-800 p-2 text-center text-sm text-slate-400 border-r border-slate-700">
              {timeSlot}
            </div>

            {/* Day Columns */}
            {weekDays.map((date, dayIndex) => {
              const dayEvents = getEventsForDayAndTime(date, timeSlot);
              const isToday = date.isSame(today, "day");

              return (
                <div
                  key={dayIndex}
                  className={`bg-slate-900 p-2 min-h-[60px] border-r border-slate-700 last:border-r-0 ${
                    isToday ? 'bg-blue-950' : ''
                  }`}
                >
                  {dayEvents.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      onClick={() => onEventClick && onEventClick(event)}
                      className="text-xs p-1 mb-1 rounded truncate cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: event.color, color: "#fff" }}
                      title={`${event.title} - ${event.time}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

    </div>
  );
}

export default CalendarGrid;