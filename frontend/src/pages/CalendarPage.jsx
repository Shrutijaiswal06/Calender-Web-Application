import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import EventPanel from "../components/EventPanel/EventPanel";
import EventModal from "../components/Event/EventModal";

function CalendarPage() {

  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch local events
      const localResponse = await fetch("http://localhost:5001/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let allEvents = [];

      if (localResponse.ok) {
        const localData = await localResponse.json();
        if (Array.isArray(localData)) {
          allEvents = [...localData];
        }
      }

      // Fetch Google Calendar events
      try {
        const googleResponse = await fetch("http://localhost:5001/api/google-calendar/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (googleResponse.ok) {
          const googleData = await googleResponse.json();
          if (Array.isArray(googleData)) {
            allEvents = [...allEvents, ...googleData];
          }
        }
      } catch (googleError) {
        console.log("Google Calendar not connected or error fetching:", googleError);
      }

      setEvents(allEvents);

    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5001/api/event-types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch event types");
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setEventTypes(data);
      } else {
        setEventTypes([]);
      }

    } catch (error) {
      console.error("Error fetching event types:", error);
    }
  };

  const addEvent = async (event) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        console.error("Failed to add event");
        return;
      }

      const newEvent = await response.json();
      setEvents([...events, newEvent]);

    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const addEventType = async (eventType) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5001/api/event-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventType),
      });

      if (!response.ok) {
        console.error("Failed to add event type");
        return;
      }

      // Refetch event types to ensure everything is in sync
      await fetchEventTypes();

    } catch (error) {
      console.error("Error adding event type:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchEventTypes();
  }, []);

  return (
    <DashboardLayout
      openEventModal={() => setIsModalOpen(true)}
      eventTypes={eventTypes}
      addEventType={addEventType}
    >

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
        eventTypes={eventTypes}
      />

    </DashboardLayout>
  );
}

export default CalendarPage;