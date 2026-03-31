import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import EventPanel from "../components/EventPanel/EventPanel";
import EventModal from "../components/Event/EventModal";

function CalendarPage() {

  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [googleAuthStatus, setGoogleAuthStatus] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, skipping event fetch");
        return;
      }

      // Fetch local events
      const localResponse = await fetch("http://localhost:5000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let allEvents = [];

      if (localResponse.ok) {
        const localData = await localResponse.json();
        if (Array.isArray(localData)) {
          console.log("Fetched local events:", localData);
          allEvents = [...localData];
        }
      } else {
        console.error("Failed to fetch local events:", localResponse.status);
      }

      // Fetch Google Calendar events
      try {
        const googleResponse = await fetch("http://localhost:5000/api/google-calendar/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (googleResponse.ok) {
          const googleData = await googleResponse.json();
          if (Array.isArray(googleData)) {
            console.log("Fetched Google Calendar events:", googleData);
            allEvents = [...allEvents, ...googleData];
          }
        } else {
          console.log("Google Calendar not connected, status:", googleResponse.status);
        }
      } catch (googleError) {
        console.log("Google Calendar not connected or error fetching:", googleError);
      }

      console.log("Total events to display:", allEvents);
      setEvents(allEvents);

    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, skipping event types fetch");
        return;
      }

      const response = await fetch("http://localhost:5000/api/event-types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch event types, status:", response.status);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        console.log("Fetched event types:", data);
        setEventTypes(data);
      } else {
        console.warn("Event types response is not an array:", data);
        setEventTypes([]);
      }

    } catch (error) {
      console.error("Error fetching event types:", error);
    }
  };

  const addEvent = async (event) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to create an event");
        return;
      }

      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add event:", errorData);
        alert(`Failed to add event: ${errorData.message}`);
        return;
      }

      const newEvent = await response.json();
      console.log("Event created successfully:", newEvent);
      
      // Show success notification
      setNotificationMessage('✓ Event created successfully!');
      const timer = setTimeout(() => setNotificationMessage(null), 3000);
      
      // Refetch events to ensure consistency
      await fetchEvents();
      
      return () => clearTimeout(timer);

    } catch (error) {
      console.error("Error adding event:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const addEventType = async (eventType) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to create an event type");
        return;
      }

      // Validation
      if (!eventType.name || !eventType.name.trim()) {
        alert("Please enter event type name");
        return;
      }
      if (!eventType.color) {
        alert("Please select a color");
        return;
      }

      const response = await fetch("http://localhost:5000/api/event-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventType),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add event type:", errorData);
        alert(`Failed to create event type: ${errorData.message}`);
        return;
      }

      console.log("Event type created successfully");
      // Refetch event types to ensure everything is in sync
      await fetchEventTypes();

    } catch (error) {
      console.error("Error adding event type:", error);
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    // Check for Google auth query parameter
    const params = new URLSearchParams(location.search);
    const authStatus = params.get('google_auth');
    if (authStatus) {
      setGoogleAuthStatus(authStatus);
      // Clear the notification after 5 seconds
      const timer = setTimeout(() => setGoogleAuthStatus(null), 5000);
      // Clean up URL by removing query parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

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

      {(googleAuthStatus || notificationMessage) && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse ${
          (googleAuthStatus === 'success' || notificationMessage?.includes('✓')) 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {notificationMessage || (
            googleAuthStatus === 'success' 
              ? '✓ Google Calendar connected successfully!' 
              : '✗ Failed to connect Google Calendar'
          )}
        </div>
      )}

      <div className="flex gap-6">

        <div className="flex-1">
          <CalendarGrid
            events={events}
            onEventClick={setSelectedEvent}
            onCreateEvent={() => setIsModalOpen(true)}
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