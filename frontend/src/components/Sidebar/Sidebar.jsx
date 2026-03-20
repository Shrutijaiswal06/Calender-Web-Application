import { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar({ openEventModal, eventTypes = [], addEventType }) {

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeColor, setNewTypeColor] = useState("#3b82f6");

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

  const handleGoogleAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/auth/google", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to get Google auth URL");
        return;
      }

      const data = await response.json();
      window.location.href = data.authUrl;
    } catch (error) {
      console.error("Error initiating Google auth:", error);
    }
  };

  const handleDeleteType = async (typeId) => {
    if (!window.confirm('Are you sure you want to delete this event type?')) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/event-types/${typeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to delete event type");
        return;
      }

      // Refresh the page to update the event types
      window.location.reload();
    } catch (error) {
      console.error("Error deleting event type:", error);
    }
  };

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

      {/* Google Calendar Integration */}
      {isLoggedIn && (
        <div>
          <button
            onClick={handleGoogleAuth}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded mb-2 flex items-center justify-center gap-2"
          >
            <span>🔗</span>
            Connect Google Calendar
          </button>
        </div>
      )}

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

          {/* User-created Event Types */}
          {eventTypes.map((type, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                <span>{type.name}</span>
              </div>
              <button
                onClick={() => handleDeleteType(type._id)}
                className="text-red-400 hover:text-red-300 text-xs px-1"
                title="Delete event type"
              >
                ✕
              </button>
            </div>
          ))}

          {eventTypes.length === 0 && (
            <div className="text-slate-500 text-xs italic">
              No event types yet. Add one above.
            </div>
          )}

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