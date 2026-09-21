import { useEffect, useMemo, useState } from "react";

function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [events, setEvents] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/devices`).then((res) =>
        res.json()
      ),
      fetch(`${import.meta.env.VITE_API_URL}/api/events`).then((res) =>
        res.json()
      ),
      fetch(`${import.meta.env.VITE_API_URL}/api/incidents`).then((res) =>
        res.json()
      ),
    ])
      .then(([devicesData, eventsData, incidentsData]) => {
        setDevices(devicesData);
        setEvents(eventsData);
        setIncidents(incidentsData);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, []);

  const criticalIncidents = useMemo(() => {
    return incidents.filter(
      (incident) => incident.severity === "CRITICAL"
    ).length;
  }, [incidents]);

  const stats = [
    {
      title: "Total Devices",
      value: devices.length,
    },
    {
      title: "Total Events",
      value: events.length,
    },
    {
      title: "Total Incidents",
      value: incidents.length,
    },
    {
      title: "Critical Incidents",
      value: criticalIncidents,
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: "5px" }}>
        Network Monitoring System
      </h1>

      <p style={{ color: "#6b7280", marginBottom: "30px" }}>
        Monitor network devices, events, and incidents.
      </p>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.title}
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <p style={{ color: "#6b7280", margin: 0 }}>
              {stat.title}
            </p>

            <h2 style={{ marginTop: "10px", fontSize: "32px" }}>
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Devices */}
      <section style={{ marginBottom: "35px" }}>
        <h2>Network Devices</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
          }}
        >
          {devices.map((device) => (
            <div
              key={device.device_id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              <h3>{device.device_name}</h3>

              <p>
                <strong>Type:</strong> {device.device_type}
              </p>

              <p>
                <strong>IP:</strong> {device.ip_address}
              </p>

              <p>
                <strong>Status:</strong> {device.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Events */}
      <section style={{ marginBottom: "35px" }}>
        <h2>Recent Events</h2>

        <div style={{ display: "grid", gap: "12px" }}>
          {events.slice(0, 4).map((event) => (
            <div
              key={event.event_id}
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              <strong>{event.event_type}</strong>

              <p style={{ margin: "8px 0" }}>
                {event.message}
              </p>

              <small>
                Device: {event.device_name} | Severity:{" "}
                {event.severity}
              </small>
            </div>
          ))}
        </div>
      </section>

      {/* Incidents */}
      <section>
        <h2>Incidents</h2>

        <div style={{ display: "grid", gap: "12px" }}>
          {incidents.map((incident) => (
            <div
              key={incident.incident_id}
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              <h3>{incident.title}</h3>

              <p>
                <strong>Device:</strong>{" "}
                {incident.device_name}
              </p>

              <p>
                <strong>Severity:</strong>{" "}
                {incident.severity}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {incident.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;