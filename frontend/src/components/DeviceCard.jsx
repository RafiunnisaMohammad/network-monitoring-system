function DeviceCard({ device, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        maxWidth: "500px",
      }}
    >
      <h3>{device.device_name}</h3>

      <p>
        <strong>Type:</strong> {device.device_type}
      </p>

      <p>
        <strong>IP Address:</strong> {device.ip_address}
      </p>

      <p>
        <strong>Location:</strong> {device.location}
      </p>

      <p>
        <strong>Status:</strong> {device.status}
      </p>

      <button onClick={() => onDelete(device.device_id)}>
        Delete Device
      </button>
    </div>
  );
}

export default DeviceCard;