
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Custom middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Network Monitoring System API is running",
  });
});

// Database test route
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database()");

    res.json({
      message: "PostgreSQL connected successfully",
      database: result.rows[0].current_database,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Devices API
app.get("/api/devices", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.device_id,
        d.device_name,
        d.ip_address,
        dt.type_name AS device_type,
        d.location,
        d.status
      FROM devices d
      JOIN device_types dt
        ON d.device_type_id = dt.device_type_id
      ORDER BY d.device_id;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch devices",
    });
  }
});

// Get Device by ID
app.get("/api/devices/:id", async (req, res) => {
  try {
    const deviceId = req.params.id;

    const result = await pool.query(
      `
      SELECT
        d.device_id,
        d.device_name,
        d.ip_address,
        dt.type_name AS device_type,
        d.location,
        d.status
      FROM devices d
      JOIN device_types dt
        ON d.device_type_id = dt.device_type_id
      WHERE d.device_id = $1;
      `,
      [deviceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch device",
    });
  }
});

// Add New Device
app.post("/api/devices", async (req, res) => {
  try {
    const {
      device_name,
      ip_address,
      device_type_id,
      location,
      status
    } = req.body;

        if (!device_name || !ip_address || !device_type_id || !location) {
      return res.status(400).json({
        message: "Device name, IP address, device type, and location are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO devices
      (device_name, ip_address, device_type_id, location, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [
        device_name,
        ip_address,
        device_type_id,
        location,
        status || "UP"
      ]
    );

    res.status(201).json({
      message: "Device created successfully",
      device: result.rows[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create device"
    });
  }
});



// Update Incident Status
app.patch("/api/incidents/:id/status", async (req, res) => {
  try {
    const incidentId = req.params.id;
    const { status } = req.body;

    if (!status) {
  return res.status(400).json({
    message: "Status is required",
  });
}

if (!["OPEN", "IN_PROGRESS", "RESOLVED"].includes(status)) {
  return res.status(400).json({
    message: "Invalid status. Use OPEN, IN_PROGRESS, or RESOLVED",
  });
}

    const result = await pool.query(
      `
      UPDATE incidents
      SET status = $1
      WHERE incident_id = $2
      RETURNING *;
      `,
      [status, incidentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Incident not found",
      });
    }

    res.json({
      message: "Incident status updated successfully",
      incident: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update incident status",
    });
  }
});

// Delete Device
app.delete("/api/devices/:id", async (req, res) => {
  try {
    const deviceId = req.params.id;

    const result = await pool.query(
      `
      DELETE FROM devices
      WHERE device_id = $1
      RETURNING *;
      `,
      [deviceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    res.json({
      message: "Device deleted successfully",
      device: result.rows[0],
    });
  } catch (error) {
  console.error(error);

  if (error.code === "23503") {
    return res.status(409).json({
      message:
        "Cannot delete device because it has related network events or incidents.",
    });
  }

  res.status(500).json({
    message: "Failed to delete device",
  });
}
});

// Delete Device
app.delete("/api/devices/:id", async (req, res) => {
  try {
    const deviceId = req.params.id;

    const result = await pool.query(
      `
      DELETE FROM devices
      WHERE device_id = $1
      RETURNING *;
      `,
      [deviceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    res.json({
      message: "Device deleted successfully",
      device: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete device",
    });
  }
});

// Network Events API
app.get("/api/events", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.event_id,
        d.device_name,
        e.event_type,
        e.severity,
        e.message,
        e.created_at
      FROM network_events e
      JOIN devices d
        ON e.device_id = d.device_id
      ORDER BY e.created_at DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch network events",
    });
  }
});

// Incidents API
app.get("/api/incidents", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        i.incident_id,
        i.title,
        d.device_name,
        u.name AS assigned_to,
        i.severity,
        i.status,
        i.description,
        i.created_at
      FROM incidents i
      JOIN devices d
        ON i.device_id = d.device_id
      JOIN users u
        ON i.assigned_to = u.user_id
      ORDER BY i.created_at DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch incidents",
    });
  }
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong on the server",
  });
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});