import { useEffect, useState } from "react";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/events`)
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) =>
        console.error("Error fetching events:", error)
      );
  }, []);

  return (
    <div>
      <h1>Network Events</h1>

      <p style={{ color: "#6b7280", marginBottom: "30px" }}>
        View recent network events detected by the system.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {events.map((event) => (
          <div
            key={event.event_id}
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>{event.event_type}</h2>

            <p>
              <strong>Device:</strong>{" "}
              {event.device_name}
            </p>

            <p>
              <strong>Severity:</strong>{" "}
              {event.severity}
            </p>

            <p style={{ color: "#6b7280" }}>
              {event.message}
            </p>

            <small style={{ color: "#6b7280" }}>
              Event ID: {event.event_id}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;