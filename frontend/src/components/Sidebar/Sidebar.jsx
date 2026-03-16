import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Sidebar({ openEventModal, eventTypes = [], addEventType }) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeColor, setNewTypeColor] = useState("#3b82f6");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  const handleAddType = () => {
    if (newTypeName.trim()) {
      addEventType({
        name: newTypeName.trim(),
        color: newTypeColor
      });

      setNewTypeName("");
      setNewTypeColor("#3b82f6");
      setShowAddForm(false);
    }
  };

  const predefinedTypes = [
    "Meeting",
    "Holiday",
    "Deadline",
    "Personal",
    "Company Event"
  ];

  const customTypes = Array.isArray(eventTypes)
    ? eventTypes.filter(type => !predefinedTypes.includes(type.name))
    : [];

  return (
    <div className="w-64 bg-slate-800 p-5 flex flex-col gap-6">

      <h1 className="text-xl font-bold">JAISWAL & CO.</h1>

      <nav className="flex flex-col gap-3">

        <button className="text-left hover:bg-slate-700 p-2 rounded">
          Calendar
        </button>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-left hover:bg-slate-700 p-2 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="text-left hover:bg-slate-700 p-2 rounded"
          >
            Login
          </Link>
        )}

      </nav>

      {/* Event Types */}

      <div>

        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-slate-400">Event Types</p>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs bg-slate-600 hover:bg-slate-500 px-2 py-1 rounded"
          >
            + Add
          </button>
        </div>

        {showAddForm && (
          <div className="mb-3 p-2 bg-slate-700 rounded">

            <input
              type="text"
              placeholder="Type name"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="w-full p-1 mb-2 rounded bg-slate-600 text-white text-sm"
            />

            <div className="flex items-center gap-2 mb-2">

              <label className="text-xs">Color:</label>

              <input
                type="color"
                value={newTypeColor}
                onChange={(e) => setNewTypeColor(e.target.value)}
                className="w-8 h-6 rounded"
              />

            </div>

            <div className="flex gap-2">

              <button
                onClick={handleAddType}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-xs px-2 py-1 rounded"
              >
                Add
              </button>

              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded"
              >
                Cancel
              </button>

            </div>

          </div>
        )}

        <div className="flex flex-col gap-2 text-sm">

          {/* Predefined Types */}

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Meeting</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Holiday</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Deadline</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span>Personal</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span>Company Event</span>
          </div>

          {/* Custom Event Types */}

          {customTypes.map((type, index) => (
            <div key={`custom-${index}`} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: type.color }}
              />
              <span>{type.name}</span>
            </div>
          ))}

        </div>

      </div>

      {/* Mini Calendar */}

      <div className="bg-slate-700 p-3 rounded">
        Mini Calendar
      </div>

      {/* Add Event */}

      <button
        onClick={openEventModal}
        className="mt-auto bg-blue-500 hover:bg-blue-600 p-2 rounded"
      >
        + Add Event
      </button>

    </div>
  );
}

export default Sidebar;