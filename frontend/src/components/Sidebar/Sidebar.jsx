import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUserId } from "../../utils/tokenUtils";

function Sidebar({ openEventModal, eventTypes = [], addEventType }) {

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

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
      const response = await fetch("http://localhost:5000/api/auth/google", {
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
      const response = await fetch(`http://localhost:5000/api/event-types/${typeId}`, {
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
    <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-screen overflow-hidden">
      
      {/* Top Section - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">⚙</div>
            <h1 className="text-lg font-bold text-white">The Silent Engine</h1>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">PRODUCTIVITY WORKSPACE</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <span>📅</span>
            <span className="text-sm">Calendar</span>
          </button>
          
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <span>🏷️</span>
            <span className="text-sm">Event Types</span>
          </button>
        </nav>

        {/* My Calendars Section */}
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">MY CALENDARS</p>
          <div className="flex flex-col gap-2 text-sm">
            {eventTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 group transition-colors">
                <div className="flex items-center gap-2 flex-1">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-slate-300">{type.name}</span>
                </div>
                {currentUserId && type.user === currentUserId && (
                  <button
                    onClick={() => handleDeleteType(type._id)}
                    className="text-slate-400 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete event type"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {eventTypes.length === 0 && (
              <div className="text-slate-500 text-xs italic px-3">
                No calendars yet
              </div>
            )}
          </div>
        </div>

        {/* Add Event Type Form */}
        {showAddForm && (
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <input
              type="text"
              placeholder="Calendar name"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-slate-700 text-white text-sm border border-slate-600 focus:border-blue-500 outline-none"
            />

            <div className="flex items-center gap-2 mb-3">
              <label className="text-xs text-slate-400">Color:</label>
              <input
                type="color"
                value={newTypeColor}
                onChange={(e) => setNewTypeColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddType}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg font-medium transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors border border-slate-700"
          >
            + Add Calendar
          </button>
        )}

      </div>

      {/* Bottom Section - Always Visible */}
      <div className="border-t border-slate-700 bg-slate-900 p-4 flex flex-col gap-3">
        
        {/* Google Calendar Integration */}
        {isLoggedIn && (
          <button
            onClick={handleGoogleAuth}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors text-sm"
          >
            <span>🔗</span>
            Connect Google Calendar
          </button>
        )}

        {/* Footer - User Info and Logout */}
        <div className="border-t border-slate-700 pt-3 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            {currentUser && (
              <div>
                <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-400">PRO MEMBER</p>
              </div>
            )}
            {!currentUser && isLoggedIn && (
              <div>
                <p className="text-sm font-medium text-white">User</p>
                <p className="text-xs text-slate-400">MEMBER</p>
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              title="Logout"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              title="Login"
            >
              Login
            </Link>
          )}
        </div>

      </div>

    </div>
  );
}

export default Sidebar;