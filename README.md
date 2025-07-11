🏏 Cricket Scoring System
A comprehensive cricket scoring and management system that allows organizers to create tournaments and matches, scorers to record live match data, and viewers to follow matches in real-time.

📌 Project Overview
The Cricket Scoring System is a full-stack web application designed to modernize cricket scoring and tournament management. It provides dedicated interfaces for various roles:

Organizers: Manage tournaments, teams, and matches

Scorers: Record live match data

Players: View and manage performance stats

Viewers: Follow matches in real-time

🗂️ Project Structure
graphql
Copy
Edit
CricketScoringSystem/
├── .gitignore
├── FIREBASE_SETUP.md          # Firebase setup instructions
├── README.md                  # Project documentation

├── analytics/                 # Data analysis components
│   ├── api/
│   │   ├── app.py             # Flask API entry point
│   │   └── routes.py          # Analytics routes
│   └── scripts/
│       ├── bowler_consistency.py     # Bowler analysis
│       └── strategy_suggester.py     # Match strategies

├── backend/                   # Node.js backend
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Match.js
│   │   ├── MatchState.js
│   │   ├── Player.js
│   │   ├── Registration.js
│   │   ├── Tournament.js
│   │   └── User.js
│   ├── routes/
│   │   ├── PstatsRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── matchStateRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── tournamentRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   └── package.json

├── frontend/                  # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Components/
│   │   ├── Screens/
│   │   │   ├── Auth/
│   │   │   ├── Organiser/
│   │   │   ├── Player/
│   │   │   ├── PlayerStats/
│   │   │   ├── Scorer/
│   │   │   └── Viewer/
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   └── firebase.js
│   ├── package.json
│   └── vite.config.js

└── shared/
    └── schema.json            # Common data schemas
⚙️ Tech Stack
🔧 Backend
Node.js – JavaScript runtime

Express – Backend framework

MongoDB – Database

Mongoose – ODM for MongoDB

Socket.IO – Real-time data sync

Firebase Admin SDK – Authentication & Security

💻 Frontend
React – UI library

React Router – Routing

Vite – Build tool

Tailwind CSS – Styling

Axios – API requests

Socket.IO Client – Real-time updates

Firebase – Auth

📊 Analytics
Python – Scripting

Flask – API server for analytics

🚀 Features
✅ Implemented
User Management

Multi-role authentication: Organizer, Scorer, Player, Viewer

Firebase integration & role-based access

Tournament Management

Create/manage tournaments

Team & player registration

Schedule matches

Match Management

Assign scorers

Ball-by-ball live scoring

Innings and event tracking

Real-time updates (WebSockets)

Scorer Interface

Wickets, extras, runs tracking

Summary generation

Viewer Interface

Live match updates

Scorecards and news

Player Features

Profile view

Stats dashboard

Captain approval flow

🛠️ In Progress
Bowler consistency and strategy analytics

Advanced statistics and insights

Mobile responsiveness

Offline scoring support

🧠 Planned
Deployment pipeline

Performance optimizations

Data visualizations

Mobile app (React Native/Flutter)

🛠️ Setup Instructions
📌 Prerequisites
Node.js (v14+)

MongoDB

Firebase project

Python 3.8+

🔐 Firebase Setup
Refer to FIREBASE_SETUP.md

⚙️ Backend Setup
bash
Copy
Edit
cd backend
npm install
Create a .env file:

env
Copy
Edit
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
Start the server:

bash
Copy
Edit
npm run dev
🌐 Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
Access: http://localhost:5173

📊 Analytics Setup (Optional)
bash
Copy
Edit
cd analytics
python -m venv venv
Activate environment:

bash
Copy
Edit
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
Install dependencies:

bash
Copy
Edit
pip install -r requirements.txt
Run the Flask API:

bash
Copy
Edit
cd api
python app.py
📈 Project Status
✅ Completed
Role-based user system

Tournament/match creation

Real-time match scoring

Player stats tracking

🔄 In Progress
Analytics engine

Mobile-friendly UI

Offline scoring

🔜 Planned
Deployment & CI/CD

Data viz dashboards

Native mobile app

🤝 Contributing
Contributions are welcome!
Please submit a Pull Request or open an Issue.

📄 License
This project is licensed under the ISC License.
See LICENSE for details.