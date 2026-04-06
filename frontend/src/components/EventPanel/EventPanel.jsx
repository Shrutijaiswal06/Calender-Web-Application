import { convertTo12Hour, convertISOToTime } from "../../utils/timeUtils";

function EventPanel({ event }) {

  if (!event) {
    return (
      <div className="w-80 bg-slate-800 p-5 border-l border-slate-700">
        <h2 className="text-lg font-bold mb-4">Event Details</h2>
        <p className="text-slate-400">Select an event to view details</p>
      </div>
    );
  }

  const formatUrl = (url) => {
    if (!url) return "";
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    // Check if it's an ISO datetime (Google Calendar format)
    if (time.includes('T')) {
      return convertISOToTime(time);
    }
    // Check if it's already in HH:MM format
    if (time.match(/^\d{2}:\d{2}/)) {
      return convertTo12Hour(time);
    }
    return time;
  };

  return (
    <div className="w-80 bg-slate-800 p-5 border-l border-slate-700">

      <h2 className="text-lg font-bold mb-4">Event Details</h2>

      <div className="flex flex-col gap-3 text-sm">

        <p>
          <strong>Title:</strong> {event.title}
        </p>

        {(event.description) && (
          <p>
            <strong>Description:</strong> {event.description}
          </p>
        )}

        <p>
          <strong>Date:</strong> {event.date}
        </p>

        <p>
          <strong>Time:</strong> {formatTime(event.time)}
        </p>

        {event.location && (
          <p>
            <strong>Location:</strong> {event.location}
          </p>
        )}

        {event.url && (
          <p>
            <strong>URL:</strong>{" "}
            <a
              href={formatUrl(event.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Join Meeting
            </a>
          </p>
        )}

        <p>
          <strong>Category:</strong> {event.eventType?.name || (event.category || 'Unknown')}
        </p>

      </div>

    </div>
  );
}

export default EventPanel;