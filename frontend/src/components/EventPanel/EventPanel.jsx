function EventPanel({ event }) {

  if (!event) {
    return (
      <div className="w-80 bg-slate-800 p-5 border-l border-slate-700">
        <h2 className="text-lg font-bold mb-4">Event Details</h2>
        <p className="text-slate-400">Select an event to view details</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-slate-800 p-5 border-l border-slate-700">

      <h2 className="text-lg font-bold mb-4">Event Details</h2>

      <div className="flex flex-col gap-3 text-sm">

        <p>
          <strong>Title:</strong>{" "}
          <span style={{ color: event.color }}>{event.title}</span>
        </p>

        <p><strong>Date:</strong> {event.date}</p>

        <p><strong>Time:</strong> {event.time}</p>

        <p><strong>Location:</strong> {event.location}</p>

        <p>
          <strong>URL:</strong>{" "}
          <a href={event.url} className="text-blue-400">
            Join Meeting
          </a>
        </p>

        <p><strong>Category:</strong> {event.category}</p>

        <p>
          <strong>Color:</strong>{" "}
          <span
            className="inline-block w-4 h-4 rounded"
            style={{ backgroundColor: event.color }}
          ></span>
        </p>

      </div>

    </div>
  );
}

export default EventPanel;