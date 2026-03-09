import { useState } from "react";

function EventModal({ isOpen, onClose, onSave }) {

  // color defaults based on category
  const categoryColors = {
    Meeting: "#3b82f6",
    Holiday: "#10b981",
    Deadline: "#ef4444",
    Personal: "#8b5cf6",
    "Company Event": "#f59e0b",
  };

  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    url: "",
    category: "Meeting",
    // color will be derived from category on submit
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

    // compute colour from category before saving
    const eventWithColor = {
      ...eventData,
      color: categoryColors[eventData.category] || "#3b82f6",
    };

    onSave(eventWithColor);

    setEventData({
      title: "",
      date: "",
      time: "",
      location: "",
      url: "",
      category: "Meeting",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

      <div className="bg-slate-800 p-6 rounded-lg w-96">

        <h2 className="text-xl font-bold mb-4">Add Event</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={eventData.title}
            onChange={handleChange}
            className="p-2 rounded bg-slate-700"
          />

          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            className="p-2 rounded bg-slate-700"
          />

          <input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
            className="p-2 rounded bg-slate-700"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={eventData.location}
            onChange={handleChange}
            className="p-2 rounded bg-slate-700"
          />

          <input
            type="text"
            name="url"
            placeholder="Meeting URL"
            value={eventData.url}
            onChange={handleChange}
            className="p-2 rounded bg-slate-700"
          />

          <select
            name="category"
            value={eventData.category}
            onChange={handleChange}
            className="p-2 rounded bg-slate-700"
          >
            <option>Meeting</option>
            <option>Holiday</option>
            <option>Deadline</option>
            <option>Personal</option>
            <option>Company Event</option>
          </select>


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