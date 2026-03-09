import Sidebar from "../components/Sidebar/Sidebar";

function DashboardLayout({ children, openEventModal }) {

  return (
    <div className="flex h-screen bg-slate-900 text-white">

      <Sidebar openEventModal={openEventModal} />

      <div className="flex-1 p-6 overflow-auto">
        {children}
      </div>

    </div>
  );
}

export default DashboardLayout;