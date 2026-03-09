import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import EventPanel from "../components/EventPanel/EventPanel";
import EventModal from "../components/Event/EventModal";

function CalendarPage() {

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addEvent = (event) => {
    setEvents([...events, event]);
  };

  return (
    <DashboardLayout openEventModal={() => setIsModalOpen(true)}>

      <div className="flex gap-6">

        <div className="flex-1">
          <CalendarGrid
            events={events}
            onEventClick={setSelectedEvent}
          />
        </div>

        <EventPanel event={selectedEvent} />

      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addEvent}
      />

    </DashboardLayout>
  );
}

export default CalendarPage;