import { useState } from "react";

function EventModal({ isOpen, onClose, onSave, eventTypes }) {

  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    url: "",
    eventType: "",
    color: "#3b82f6"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get color from selected event type
    const selectedType = eventTypes.find(type => type._id === eventData.eventType);
    const eventWithColor = {
      ...eventData,
      color: selectedType ? selectedType.color : "#3b82f6",
    };

    onSave(eventWithColor);

    setEventData({
      title: "",
      date: "",
      time: "",
      location: "",
      url: "",
      eventType: "",
      color: "#3b82f6"
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center backdrop-blur-sm">

      <div className="bg-slate-800 p-8 rounded-lg w-[500px]">

        <h2 className="text-xl font-bold mb-4">Add Event</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-lg">📝</span>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={eventData.title}
              onChange={handleChange}
              className="flex-1 p-3 rounded bg-slate-700 text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-green-400 text-lg">📅</span>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className="flex-1 p-3 rounded bg-slate-700 text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg">⏰</span>
            <input
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              className="flex-1 p-3 rounded bg-slate-700 text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-lg">📍</span>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={eventData.location}
              onChange={handleChange}
              className="flex-1 p-3 rounded bg-slate-700 text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-red-400 text-lg">🔗</span>
            <input
              type="text"
              name="url"
              placeholder="Meeting URL"
              value={eventData.url}
              onChange={handleChange}
              className="flex-1 p-3 rounded bg-slate-700 text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-orange-400 text-lg">🏷️</span>
            <select
              name="eventType"
              value={eventData.eventType}
              onChange={handleChange}
              className="flex-1 p-3 rounded bg-slate-700 text-white"
            >
              <option value="">Select Event Type</option>
              {eventTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>


          <div className="flex justify-between mt-4">

            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-500 px-4 py-2 rounded"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EventModal;