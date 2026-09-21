import { useEffect, useState } from "react";
import DeviceCard from "../components/DeviceCard";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    device_name: "",
    ip_address: "",
    device_type_id: 1,
    location: "",
    status: "UP",
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/devices`)
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) =>
        console.error("Error fetching devices:", error)
      );
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/devices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create device"
        );
      }

      setDevices([...devices, data.device]);

      setFormData({
        device_name: "",
        ip_address: "",
        device_type_id: 1,
        location: "",
        status: "UP",
      });
    } catch (error) {
      console.error("Error creating device:", error);
    }
  };

  const handleDelete = async (deviceId) => {
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/devices/${deviceId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete device"
        );
      }

      setDevices(
        devices.filter(
          (device) => device.device_id !== deviceId
        )
      );
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error deleting device:", error);
    }
  };

  return (
    <div>
      <h1>Network Devices</h1>

      {errorMessage && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #fecaca",
          }}
        >
          {errorMessage}
        </div>
      )}

      <p style={{ color: "#6b7280" }}>
        Manage and monitor connected network devices.
      </p>

      {/* Add Device Form */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          marginTop: "25px",
          marginBottom: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Add New Device</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "15px",
            maxWidth: "600px",
          }}
        >
          <input
            type="text"
            name="device_name"
            placeholder="Device Name"
            value={formData.device_name}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />

          <input
            type="text"
            name="ip_address"
            placeholder="IP Address"
            value={formData.ip_address}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />

          <select
            name="device_type_id"
            value={formData.device_type_id}
            onChange={handleChange}
            style={{
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          >
            <option value="1">Router</option>
            <option value="2">Switch</option>
            <option value="3">Server</option>
            <option value="4">Firewall</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: "#111827",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Add Device
          </button>
        </form>
      </div>

      {/* Device List */}
      <h2>Devices</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {devices.map((device) => (
          <DeviceCard
            key={device.device_id}
            device={device}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default Devices;