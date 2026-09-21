import { useEffect, useState } from "react";

function Incidents() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/incidents`)
      .then((response) => response.json())
      .then((data) => setIncidents(data))
      .catch((error) =>
        console.error("Error fetching incidents:", error)
      );
  }, []);

  const updateStatus = async (incidentId, newStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/incidents/${incidentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update incident"
        );
      }

      setIncidents(
        incidents.map((incident) =>
          incident.incident_id === incidentId
            ? {
                ...incident,
                status: data.incident.status,
              }
            : incident
        )
      );
    } catch (error) {
      console.error("Error updating incident:", error);
    }
  };

  return (
    <div>
      <h1>Network Incidents</h1>

      <p style={{ color: "#6b7280", marginBottom: "30px" }}>
        Monitor and manage network incidents.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {incidents.map((incident) => (
          <div
            key={incident.incident_id}
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>{incident.title}</h2>

            <p>
              <strong>Device:</strong>{" "}
              {incident.device_name}
            </p>

            <p>
              <strong>Assigned To:</strong>{" "}
              {incident.assigned_to}
            </p>

            <p>
              <strong>Severity:</strong>{" "}
              {incident.severity}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {incident.status}
            </p>

            <p style={{ color: "#6b7280" }}>
              {incident.description}
            </p>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() =>
                  updateStatus(
                    incident.incident_id,
                    "IN_PROGRESS"
                  )
                }
                style={{
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "7px",
                  marginRight: "10px",
                }}
              >
                In Progress
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    incident.incident_id,
                    "RESOLVED"
                  )
                }
                style={{
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "7px",
                }}
              >
                Resolve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Incidents;