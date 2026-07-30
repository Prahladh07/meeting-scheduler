# Meeting Scheduler

A functional meeting scheduler web app — login by name, create/join meeting spaces via a code, schedule meetings, and get an on-screen notification 5 minutes before a meeting starts.

## Features

- Login with just your name
- Create a meeting space and get a shareable code
- Join an existing meeting space using a code
- Schedule a meeting visible to everyone in the space
- On-screen notification 5 minutes before a meeting starts

## Tech stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)

## Setup

### Backend

```bash
npm install
node server.js
```

Requires a `.env` file in the root with:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`). Make sure the backend is running first so login/create/join work correctly.

## Project structure

```
meeting-scheduler/
├── server.js          # Express server + routes
├── models/            # Mongoose schemas (User, MeetingSpace, Meeting)
└── frontend/           # React app (Vite)
    └── src/
        ├── api.js       # Backend API calls
        ├── App.jsx      # Top-level screen routing
        └── components/  # Login, SpaceSelect, SpaceDashboard, MeetingCard, NotificationPopup
```
