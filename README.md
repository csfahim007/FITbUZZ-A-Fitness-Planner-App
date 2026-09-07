# 🏋️ FITbUZZ — Full-Stack Fitness Planner

**FITbUZZ** is a full-stack fitness planning and progress-tracking platform designed to help users organize workouts, manage exercises, track nutrition, and visualize their fitness progress from a single dashboard.

The project demonstrates a complete **Next.js + Node.js + Express + MongoDB** application with JWT authentication, protected API routes, centralized frontend state management, data visualization, and a production deployment workflow.

🌐 **Live Project:** https://fitbuzz.cloudafk.xyz/


## ✨ Overview

FITbUZZ brings the core features of a personal fitness management platform into one application.

Users can:

* 🔐 Create accounts and securely authenticate
* 🏋️ Create and manage workout plans
* 💪 Browse and manage exercises
* 🥗 Track daily nutrition
* 📊 Monitor fitness and nutrition progress
* 📈 Visualize data through interactive charts
* 🔗 Share workouts
* 🎯 Manage their fitness activity through a centralized dashboard

The application is built with a separated frontend and backend architecture, making it easier to develop, test, deploy, and scale individual parts of the system.

---

## 🚀 Live Application

### Production

**FITbUZZ:**
https://fitbuzz.cloudafk.xyz/

The application is deployed as a production-ready full-stack system with separate frontend and backend services.

---

## 🎯 Key Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected API endpoints
* Authenticated user-specific resources
* Token-based request authorization
* Secure password handling

### 🏋️ Workout Management

Users can create and manage their workout routines.

Features include:

* Create workouts
* Edit existing workouts
* Track workout activity
* View workout history
* Manage exercises within workouts
* Share workouts

### 💪 Exercise Library

FITbUZZ provides an exercise management system that allows users to work with structured exercise data.

The exercise system is designed around reusable exercise records that can be referenced by workout plans.

### 🥗 Nutrition Tracking

Users can record and review nutrition information.

The nutrition module supports:

* Nutrition logging
* Daily summaries
* Historical records
* Nutrition-related dashboard data

### 📊 Progress Dashboard

The dashboard combines application data into visual summaries.

Charts provide an easier way to understand:

* Workout activity
* Nutrition trends
* Progress over time
* Fitness statistics

### 🔗 Workout Sharing

Workouts can be shared with other users, making FITbUZZ more than a private workout tracker.

---

# 🧠 Technical Architecture

FITbUZZ follows a classic **SPA + REST API + database** architecture.

```text
                    ┌──────────────────────────┐
                    │        FITbUZZ User      │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     React Frontend       │
                    │                          │
                    │ React Router             │
                    │ Redux Toolkit             │
                    │ Tailwind CSS              │
                    │ Chart.js / Recharts       │
                    └────────────┬─────────────┘
                                 │
                         HTTP / REST API
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     Express API          │
                    │                          │
                    │ Authentication           │
                    │ Middleware                │
                    │ Route Handlers            │
                    │ Business Logic            │
                    │ Validation                │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       Mongoose            │
                    │    Data Access Layer      │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │        MongoDB             │
                    │      Application Data      │
                    └──────────────────────────┘
```

This separation keeps responsibilities organized:

**Frontend → API → Business Logic → Data Access → Database**

---

# 🧩 Application Architecture

## Frontend

The frontend is a React single-page application built with Vite.

```text
React
 ├── React Router
 │    └── Application navigation
 │
 ├── Redux Toolkit
 │    └── Global application state
 │
 ├── API Layer
 │    └── Backend communication
 │
 ├── Tailwind CSS
 │    └── UI styling
 │
 └── Charts
      ├── Chart.js
      └── Recharts
```

### Frontend responsibilities

The client handles:

* User interface
* Navigation
* Authentication state
* Workout interactions
* Nutrition forms
* Dashboard visualization
* API communication
* Client-side application state

Vite provides a fast development environment and optimized production builds.

---

# ⚙️ Backend Architecture

The backend is built using **Node.js and Express** and exposes a RESTful API consumed by the React frontend.

```text
Client Request
      │
      ▼
Express Router
      │
      ▼
Authentication / Security Middleware
      │
      ▼
Route Handler / Controller
      │
      ▼
Business Logic
      │
      ▼
Mongoose Models
      │
      ▼
MongoDB
      │
      ▼
JSON Response
```

The API is organized around application domains rather than putting all functionality into a single server file.

Core API areas include:

* `/api/auth`
* `/api/workouts`
* `/api/exercises`
* `/api/nutrition`
* `/api/health`

This makes the backend easier to maintain and extend as the application grows.

---

# 🔐 Authentication Flow

FITbUZZ uses **JSON Web Tokens (JWT)** for authentication.

A typical authenticated request follows this flow:

```text
User Login
    │
    ▼
POST /api/auth/...
    │
    ▼
Validate Credentials
    │
    ▼
Generate JWT
    │
    ▼
Frontend Stores Authentication State
    │
    ▼
Authenticated API Request
    │
    ▼
JWT Verification Middleware
    │
    ▼
Protected Route
    │
    ▼
Return User-Specific Data
```

The backend verifies authentication before allowing access to protected resources.

This prevents users from directly accessing another user's protected application data through the API.

---

# 🗄️ MongoDB & Mongoose

MongoDB is used as the primary application database, with **Mongoose** providing the object modeling layer.

The database stores application data such as:

* Users
* Workouts
* Exercises
* Nutrition records
* Workout-related data
* User-specific progress information

Mongoose provides a structured interface between the Express application and MongoDB.

```text
Express
   │
   ▼
Mongoose Models
   │
   ▼
MongoDB Collections
```

This approach keeps database access separated from HTTP request handling.

---

# 📡 REST API

The backend exposes REST-style endpoints grouped by application domain.

| Area           | Base Route       | Purpose                         |
| -------------- | ---------------- | ------------------------------- |
| Authentication | `/api/auth`      | Registration and authentication |
| Workouts       | `/api/workouts`  | Workout creation and management |
| Exercises      | `/api/exercises` | Exercise library operations     |
| Nutrition      | `/api/nutrition` | Nutrition tracking              |
| Health         | `/api/health`    | API health verification         |

### Health Check

The backend provides a health endpoint:

```bash
curl http://localhost:5001/api/health
```

A dedicated health endpoint is useful for:

* Deployment verification
* Monitoring
* Reverse proxies
* Service availability checks
* Operational troubleshooting

---

# 📊 Data Visualization

FITbUZZ uses both **Chart.js** and **Recharts** to transform application data into visual dashboards.

Instead of presenting all progress information as raw numbers, the frontend provides graphical representations that make trends easier to understand.

The visualization layer is intentionally kept on the frontend, while the backend remains responsible for supplying the underlying data.

```text
MongoDB
   │
   ▼
Express API
   │
   ▼
React
   │
   ▼
Chart.js / Recharts
   │
   ▼
Interactive Dashboard
```

---

# 🧠 State Management

The frontend uses **Redux Toolkit** for centralized state management.

This provides a predictable approach for managing application-wide state such as:

* Authentication
* User information
* Workout-related state
* Shared application data
* UI/application state

Redux Toolkit reduces boilerplate compared with manually managing a large collection of Redux actions and reducers.

---

# 🎨 UI & Styling

The frontend uses **Tailwind CSS** for styling.

This allows the interface to be built from reusable utility classes while keeping styling close to the components that use it.

The application combines:

* Responsive layouts
* Reusable React components
* Form-driven interfaces
* Dashboard cards
* Interactive charts
* Workout management interfaces
* Nutrition interfaces

---

# 📁 Project Structure

```text
FITbUZZ/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── services/
│   │   ├── store/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.*
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── package.json
│   └── ...
│
├── deploy.sh
└── README.md
```

The repository is intentionally divided into:

* `client/` → React application
* `server/` → Express REST API
* `deploy.sh` → deployment automation

This separation makes the codebase easier to reason about and allows the frontend and backend to evolve independently.

---

# 🛠️ Technology Stack

## Frontend

| Technology    | Purpose                     |
| ------------- | --------------------------- |
| Next.js 15    | React framework and App Router |
| Vite          | Development & build tooling |
| TypeScript    | Static typing               |
| React 18      | UI framework                |
| Tailwind CSS  | Styling                     |
| Fetch API     | Centralized REST API client |

## Backend

| Technology | Purpose            |
| ---------- | ------------------ |
| Node.js    | JavaScript runtime |
| Express    | REST API framework |
| MongoDB    | NoSQL database     |
| Mongoose   | MongoDB ODM        |
| JWT        | Authentication     |

---

# 🔧 Prerequisites

Before running FITbUZZ locally, install:

* Node.js 18+
* npm
* MongoDB

MongoDB can either run locally or be hosted through a managed MongoDB provider.

---

# 🚀 Local Development

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd FITbUZZ
```

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

## 3. Install Backend Dependencies

```bash
cd ../server
npm install
```
## 4. Configure Environment Variables

Create:

```text
server/.env
```

Example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/fitbuzz
JWT_SECRET=replace-with-a-long-random-secret
PORT=5001
HOST=0.0.0.0
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

> Never commit real secrets, JWT keys, database credentials, or production environment variables to Git.

---

# ▶️ Running the Application

### Start the Backend

```bash
cd server
npm run dev
```
The API runs on:

```text
http://localhost:5001
```

### Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The Vite development server usually runs on:

```text
http://localhost:5173

---

# 🌐 Frontend API Configuration

The frontend can be configured to communicate with a different backend URL.

Create:

```text
client/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

For production, this value should point to the deployed API endpoint.

---

# 📜 Available Commands

## Frontend

```bash
npm run dev
```

Start the Vite development server.

```bash
npm run build
```

Create an optimized production build.

```bash
npm run lint
```


```bash
npm run preview
```

Preview the production build locally.

## Backend

```bash
npm run dev
```

Start the API using Nodemon.

```bash
npm start
```

Start the API using Node.js.

---

# 🚢 Production Deployment

FITbUZZ includes a deployment script:

```bash
```

The deployment workflow is designed to automate the process of updating the application and restarting the production services.

The deployment script:

1. Updates the application source
2. Installs frontend dependencies
3. Creates the production frontend build
4. Installs production backend dependencies
5. Restarts the configured services
6. Performs endpoint checks

The current deployment configuration expects the project at:

```text
/home/administrator/projects/FITbUZZ-A-Fitness-Planner-App
```

and uses the `main` branch.

---

# 🔄 Deployment Architecture

The production environment separates the frontend and backend into independent services.

```text
                         Internet
                            │
                            ▼
                     ┌─────────────┐
                     │ Reverse     │
                     │ Proxy       │
                     └──────┬──────┘
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
       ┌────────────────┐       ┌────────────────┐
       │ React Frontend │       │ Express API    │
       │ Production     │       │ Node.js        │
       │ Build          │       │                │
       └────────────────┘       └───────┬────────┘
                                        │
                                        ▼
                                │    MongoDB     │
                                └────────────────┘
```

This architecture allows the reverse proxy to route requests appropriately while keeping the application services separated.

---

# 🧩 Process Management

The production deployment uses **Supervisor** to manage application processes.

Configured services include:

```text
fitbuzz-backend
fitbuzz-frontend
```

Process management provides automatic service supervision and makes restarting application services during deployments straightforward.

---

# 🔄 Deployment Workflow

A simplified production deployment looks like:

```text
Developer
    │
    ▼
Push to main
    │
    ▼
Production Server
    ▼
deploy.sh
    │
    ├── Update source
    │
    ├── Install dependencies
    │
    ├── Build React application
    │
    ├── Install backend production dependencies
    │
    ├── Restart Supervisor services
    │
    └── Health checks
             │
             ▼
       Live FITbUZZ App
```

This creates a repeatable deployment process instead of manually rebuilding and restarting services.

---

# 🔒 Security

Security is handled across both the frontend and backend.

### Authentication

* JWT-based authentication
* Authentication middleware

### Backend Protection

* Authenticated resources require valid tokens
* User-specific resources are protected
* Server-side authorization is used rather than relying only on frontend checks

### Environment Security

Sensitive configuration is provided through environment variables rather than hardcoded application source.

Example:

```env
MONGO_URI=...
JWT_SECRET=...

Production secrets should never be committed to the repository.

---

# 🧪 Development & Code Quality

The frontend includes ESLint tooling for maintaining code quality.

```bash
npm run lint
```

Production builds can be verified using:

```bash
npm run build
```

The deployment process also performs service and endpoint checks after deployment.
---

# 📈 Production Considerations

The architecture provides a solid foundation for further scaling.

Potential future improvements include:

* Automated CI/CD pipelines
* Automated backend and frontend tests
* API request rate limiting
* Refresh-token authentication
* Improved API documentation with OpenAPI/Swagger
* Centralized logging
* Application monitoring
* Automated database backups
* Containerized deployment
* Horizontal API scaling
* Redis caching for frequently accessed data
* Background job processing

---

# 🗺️ Future Roadmap

Potential future features for FITbUZZ include:

### 🤖 AI Fitness Assistant

An AI assistant could help users:

* Build workout routines
* Suggest exercises
* Analyze workout history
* Provide nutrition guidance
* Answer fitness-related questions

### 📱 Mobile Application


### 📊 Advanced Analytics

Future analytics could include:

* Personal records
* Workout volume trends
* Exercise progression
* Nutrition trends
* Goal tracking
* Weekly/monthly reports

### 🔔 Notifications

Potential notification features:

* Workout reminders
* Nutrition reminders
* Progress milestones
* Goal notifications

---

# 💼 Interview Talking Points

FITbUZZ demonstrates several concepts that are useful to discuss in a software engineering interview.

### 1. Full-Stack Architecture

> “I separated the React frontend from the Express REST API so that presentation, business logic, and persistence remain independently maintainable.”

### 2. Authentication

> “I implemented JWT-based authentication with middleware protecting private API resources.”

### 3. MongoDB Data Layer


### 4. State Management

> “Redux Toolkit provides centralized frontend state management, while React Router handles client-side navigation.”

### 5. API Design

> “The backend organizes REST endpoints around application domains such as authentication, workouts, exercises, and nutrition.”

### 6. Data Visualization

> “Chart.js and Recharts transform workout and nutrition data into visual progress dashboards.”

### 7. Deployment

> “The application uses a repeatable deployment script that builds the frontend, installs production dependencies, restarts managed services, and performs endpoint checks.”

### 8. Production Architecture

> “NGINX acts as the reverse proxy while Supervisor manages the frontend and backend processes.”


# 📋 Feature Matrix

| Feature                     | Status |
| --------------------------- | :----: |
| User Registration           |    ✅   |
| JWT Authentication          |    ✅   |
| Protected API Routes        |    ✅   |
| Workout Management          |    ✅   |
| Exercise Library            |    ✅   |
| Progress Dashboard          |    ✅   |
| Data Visualization          |    ✅   |
| Workout Sharing             |    ✅   |
| MongoDB Persistence         |    ✅   |
| REST API                    |    ✅   |
| Production Build            |    ✅   |
| Automated Deployment Script |    ✅   |
| Process Management          |    ✅   |
| Health Check Endpoint       |    ✅   |

---

# 🌐 Live Demo
### FITbUZZ

**Production:**
https://fitbuzz.cloudafk.xyz/

Try the deployed application to explore the complete fitness planning workflow.

---

# 📄 License

**Copyright © 2026 [Your Name]. All Rights Reserved.**

FITbUZZ is proprietary software created for portfolio, demonstration, and interview purposes.

The source code may be viewed for technical evaluation and learning, but may not be copied, redistributed, republished, commercially exploited, or presented as another person's work without prior written permission from the copyright holder.

Public availability of this repository does not grant permission to reuse or redistribute the source code.

For licensing or commercial-use inquiries, contact the project owner.

---

# 👨‍💻 Author

Built as a full-stack engineering project demonstrating modern web application development with:

**React · Node.js · Express · MongoDB · JWT · Redux Toolkit · REST APIs · Data Visualization · Production Deployment**

⭐ If you're reviewing this project as part of an interview or technical evaluation, the architecture and implementation details above provide an overview of the major engineering decisions behind FITbUZZ.


Copyright (c) 2026 Fahim

All Rights Reserved.

FITbUZZ, including its source code, architecture, documentation, design, and associated materials, is proprietary software owned by Fahim.

Permission is granted to view and evaluate the source code solely for personal learning, educational evaluation, portfolio review, and interview purposes.

Without prior written permission from Fahim, no person or organization may:

1. Copy, reproduce, or redistribute this software or substantial portions of its source code.
2. Publish, mirror, upload, or otherwise make copies of this repository or its source code available elsewhere.
3. Modify, adapt, or create derivative works based on this software for redistribution or commercial use.
4. Sell, sublicense, lease, rent, or commercially exploit this software or substantial portions of its source code.
5. Incorporate substantial portions of this software into another product, application, or service.
6. Claim authorship or ownership of this software or its source code.
7. Remove or alter copyright, license, or attribution notices.

The software is provided "AS IS", without warranty of any kind, express or implied.

All rights not expressly granted above are reserved by Fahim.
