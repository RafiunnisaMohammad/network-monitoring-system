import { Routes, Route, Navigate, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Incidents from "./pages/Incidents";
import Devices from "./pages/Devices";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "220px",
          background: "#111827",
          color: "white",
          padding: "25px 15px",
        }}
      >
        <h2 style={{ marginBottom: "30px", textAlign: "center" }}>
          NMS
        </h2>

        <nav style={{ display: "grid", gap: "10px" }}>
          <Link
            to="/dashboard"
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: "#1f2937",
            }}
          >
            Dashboard
          </Link>

          <Link
            to="/devices"
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: "#1f2937",
            }}
          >
            Devices
          </Link>

          <Link
            to="/events"
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: "#1f2937",
            }}
          >
            Events
          </Link>

          <Link
            to="/incidents"
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: "#1f2937",
            }}
          >
            Incidents
          </Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "30px" }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/events" element={<Events />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;