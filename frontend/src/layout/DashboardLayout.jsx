import Sidebar from "../components/Sidebar/Sidebar";

function DashboardLayout({ children, openEventModal, eventTypes, addEventType }) {

  return (
    <div className="flex h-screen bg-slate-900 text-white">

      <Sidebar openEventModal={openEventModal} eventTypes={eventTypes} addEventType={addEventType} />

      <div className="flex-1 p-6 overflow-auto">
        {children}
      </div>

    </div>
  );
}

export default DashboardLayout;