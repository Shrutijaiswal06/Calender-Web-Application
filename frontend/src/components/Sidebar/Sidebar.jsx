function Sidebar({ openEventModal }) {

  return (
    <div className="w-64 bg-slate-800 p-5 flex flex-col gap-6">

      <h1 className="text-xl font-bold">JAISWAL & CO.</h1>

      <nav className="flex flex-col gap-3">
        <button className="text-left hover:bg-slate-700 p-2 rounded">
          Calendar
        </button>
      </nav>

      {/* category legend */}
      <div>
        <p className="mb-2 text-sm text-slate-400">Event Types</p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
            <span>Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
            <span>Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
            <span>Deadline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
            <span>Personal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
            <span>Company Event</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-700 p-3 rounded">
        Mini Calendar
      </div>


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