CREATE TABLE device_types (
    device_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO device_types (type_name)
VALUES
('Router'),
('Switch'),
('Server'),
('Firewall');


CREATE TABLE devices (
    device_id SERIAL PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL UNIQUE,
    device_type_id INT NOT NULL,
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'UP',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP,
    CONSTRAINT fk_device_type
        FOREIGN KEY (device_type_id)
        REFERENCES device_types(device_type_id)
);


INSERT INTO devices
(device_name, ip_address, device_type_id, location, status)
VALUES
('Router-01', '192.168.1.1', 1, 'Hyderabad', 'UP'),
('Switch-01', '192.168.1.2', 2, 'Hyderabad', 'UP'),
('Server-01', '192.168.1.10', 3, 'Hyderabad', 'UP'),
('Firewall-01', '192.168.1.254', 4, 'Hyderabad', 'UP');


CREATE TABLE network_events (
    event_id SERIAL PRIMARY KEY,
    device_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_device
        FOREIGN KEY (device_id)
        REFERENCES devices(device_id)
);


INSERT INTO network_events
(device_id, event_type, severity, message)
VALUES
(1, 'CPU_HIGH', 'WARNING', 'Router CPU usage exceeded 80%'),
(2, 'LINK_DOWN', 'CRITICAL', 'Switch port link is down'),
(3, 'SERVER_DOWN', 'CRITICAL', 'Server is not responding'),
(4, 'TRAFFIC_SPIKE', 'WARNING', 'Unusual network traffic detected');


CREATE INDEX idx_network_events_severity
ON network_events(severity);


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(30) NOT NULL DEFAULT 'ENGINEER'
);


INSERT INTO users (name, email, role)
VALUES
('Rahul', 'rahul@nms.com', 'ADMIN'),
('Anil', 'anil@nms.com', 'ENGINEER'),
('Priya', 'priya@nms.com', 'OPERATOR');


CREATE TABLE incidents (
    incident_id SERIAL PRIMARY KEY,
    device_id INT NOT NULL,
    assigned_to INT,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_incident_device
        FOREIGN KEY (device_id)
        REFERENCES devices(device_id),
    CONSTRAINT fk_incident_user
        FOREIGN KEY (assigned_to)
        REFERENCES users(user_id)
);


INSERT INTO incidents
(device_id, assigned_to, title, description, severity, status)
VALUES
(1, 2, 'High CPU Usage',
 'Router CPU usage exceeded threshold',
 'WARNING', 'OPEN'),

(2, 3, 'Switch Link Down',
 'Network switch port is not responding',
 'CRITICAL', 'OPEN'),

(3, 2, 'Server Unreachable',
 'Server is not responding to network requests',
 'CRITICAL', 'OPEN'),

(4, 1, 'Traffic Spike',
 'Unusual network traffic detected',
 'WARNING', 'RESOLVED');


CREATE TABLE incident_updates (
    update_id SERIAL PRIMARY KEY,
    incident_id INT NOT NULL,
    updated_by INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    comment VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_update_incident
        FOREIGN KEY (incident_id)
        REFERENCES incidents(incident_id),
    CONSTRAINT fk_update_user
        FOREIGN KEY (updated_by)
        REFERENCES users(user_id)
);


INSERT INTO incident_updates
(incident_id, updated_by, status, comment)
VALUES
(1, 2, 'OPEN', 'Investigating high CPU usage'),
(2, 3, 'OPEN', 'Checking affected switch port'),
(3, 2, 'OPEN', 'Checking server connectivity'),
(4, 1, 'RESOLVED', 'Traffic returned to normal');