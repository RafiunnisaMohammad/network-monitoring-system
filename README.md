# Network Monitoring System

A full-stack web application for monitoring network devices, network events, and incidents through a responsive dashboard.

## 🚀 Overview

The Network Monitoring System provides a centralized interface to view and manage network devices, monitor network events, and track incidents.

The project demonstrates full-stack development using React, Node.js, Express.js, RESTful APIs, and PostgreSQL.

## 🛠️ Tech Stack

### Frontend

* React.js
* React Hooks
* React Router
* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js
* RESTful APIs
* Middleware
* Async/Await
* Error Handling

### Database

* PostgreSQL
* SQL
* Joins
* Indexing
* Transactions
* Foreign Keys

### Development Tools

* Git
* GitHub
* Postman
* VS Code

## ✨ Features

* 📊 Network monitoring dashboard
* 🖥️ View network devices
* ➕ Add new devices
* 🗑️ Delete devices
* 📡 View network events
* 🚨 View and manage incidents
* 🔄 Update incident status
* 🔗 RESTful API integration
* 🗄️ PostgreSQL database integration
* ⚠️ API validation and error handling
* 🔐 Environment variable configuration

## 🏗️ Architecture

```text
             React Frontend
                    │
                    │ REST API
                    ▼
          Node.js + Express
                    │
                    │ SQL
                    ▼
              PostgreSQL
```

## 📂 Project Structure

```text
NetworkMonitoringSystem/
│
├── backend/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .gitignore
│
├── README.md
└── .gitignore
```

## 🔌 REST API Endpoints

| Method | Endpoint                    | Purpose                    |
| ------ | --------------------------- | -------------------------- |
| GET    | `/`                         | Check API status           |
| GET    | `/api/test-db`              | Test PostgreSQL connection |
| GET    | `/api/devices`              | Get all devices            |
| GET    | `/api/devices/:id`          | Get a device by ID         |
| POST   | `/api/devices`              | Add a new device           |
| DELETE | `/api/devices/:id`          | Delete a device            |
| GET    | `/api/events`               | Get network events         |
| GET    | `/api/incidents`            | Get incidents              |
| PATCH  | `/api/incidents/:id/status` | Update incident status     |

## 🗄️ Database Design

The PostgreSQL database contains the following main tables:

* `device_types`
* `devices`
* `network_events`
* `users`
* `incidents`
* `incident_updates`

The database uses primary keys, foreign keys, joins, indexing, and transactions to maintain data integrity and improve query performance.

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/RafiunnisaMohammad/network-monitoring-system.git
cd network-monitoring-system
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DB_PASSWORD=your_postgresql_password
```

Start the backend:

```bash
node server.js
```

Backend runs on:

```text
http://localhost:5000
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## 🔒 Environment Variables

Sensitive configuration is stored in `.env` files and excluded from Git using `.gitignore`.

Never commit database passwords, API keys, or other credentials to the re
