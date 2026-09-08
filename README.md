# FITbUZZ

FITbUZZ is a full-stack fitness planner built to help users manage workouts, exercise plans, nutrition tracking, and progress insights from a single dashboard. The application uses a modern Next.js frontend and a dedicated Express + MongoDB backend.

Live app: https://fitbuzz.cloudafk.xyz/

## Tech stack

### Frontend
- Next.js 15 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Zustand for authentication state management
- Fetch-based typed API client and service layer
- Charting via Chart.js and Recharts
- Framer Motion, Lucide, and React Icons for UI polish

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT-based authentication
- Helmet, CORS, rate limiting, sanitization, and validation middleware

### Deployment
- GitHub Actions for CI/CD
- SSH-based deployment to the VPS
- deploy.sh for production automation
- Supervisor for managing the backend and frontend services

---

## Project structure

```text
FITbUZZ/
├── client/                     # Next.js frontend
│   ├── app/                    # App Router pages and layouts
│   ├── components/             # Reusable UI and feature components
│   ├── lib/                    # API client and shared logic
│   ├── public/                 # Static assets and images
│   ├── types/                  # Shared TypeScript types
│   ├── next.config.ts          # Next config and API rewrites
│   ├── package.json
│   └── tsconfig.json
│
├── server/                     # Express API
│   ├── config/                 # Database config and environment setup
│   ├── controllers/            # Route handlers / business logic
│   ├── middleware/             # Auth, validation, and error handling
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API endpoints
│   ├── utils/                  # Helpers and utilities
│   ├── server.js               # App bootstrap and middleware setup
│   └── package.json
│
├── deploy.sh                   # Production deployment script
├── .github/workflows/          # CI/CD workflow files
├── README.md
├── client/legacy-vite/         # older Vite app kept archived
└── package.json                # root metadata (if present)
```

---

## Features

- User registration and login
- JWT authentication and protected routes
- Workout creation, editing, scheduling, and sharing
- Add exercises to workouts with sets, reps, weight, and completion status
- Exercise completion checkpoints with calories burned per completed exercise
- Server-calculated workout calorie totals shown in dashboard analytics
- Exercise library management with exercise detail and creation flows
- Nutrition tracking and summaries
- Dashboard insights, weekly calorie charts, scheduled workout counts, and monthly planner calendar
- Selected calendar-day details with links to scheduled workout pages
- Responsive layout for desktop and mobile
- Production deployment workflow with health checks

---

## Frontend overview

The frontend now runs on Next.js using the App Router rather than the older Vite-based React SPA structure.

Key responsibilities:
- App Router pages and protected layouts under `client/app`
- Server and client component boundaries for authenticated screens
- Centralized API access through `client/lib/api/client.ts` and `client/lib/api/services.ts`
- Tailwind-based responsive styling
- Dashboard visualizations, workout planning, exercise tracking, and nutrition flows

### Frontend state management

The active Next.js application uses a small, focused state architecture:

- **Zustand** stores global authentication state in `client/components/auth/AuthProvider.tsx`.
- The `useAuth()` store exposes the current user, loading state, login, registration, logout, profile updates, and account deletion.
- `AuthInitializer` loads the current session and refreshes authentication when needed.
- Components use React `useState`, `useEffect`, and `useMemo` for local form, loading, error, calendar, and derived dashboard state.
- Backend data is fetched through the typed service layer and held by the consuming component; React Query and SWR are not used.
- The older `client/legacy-vite` directory remains archived and contains the previous Redux Toolkit/RTK Query implementation. It is not used by the current Next.js routes.

The app supports both migration-era API environment variables:
- NEXT_PUBLIC_API_BASE_URL
- VITE_API_BASE_URL

If neither is defined, the app falls back to a local rewrite to the backend at http://127.0.0.1:5001.

---

## Backend overview

The backend is a Node.js + Express API with MongoDB persistence through Mongoose.

Core API domains:
- /api/auth
- /api/workouts
- /api/exercises
- /api/nutrition
- /api/share
- /api/health

Workout records support an optional planned date and exercise-level tracking metadata, including sets, reps, weight, completion state, completion time, and calories burned. Completed exercise calories are calculated server-side into the workout `totalCalories` value.

Included middleware and safeguards:
- CORS protection
- Helmet security headers
- rate limiting
- Mongo sanitization and XSS protection
- centralized error handling
- JWT verification for protected resources

---

## Local development

### 1. Clone the repository

```bash
git clone <repository-url>
cd FITbUZZ-A-Fitness-Planner-App
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create a backend file:

```bash
server/.env
```

Example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/fitbuzz
JWT_SECRET=replace-with-a-long-random-secret
PORT=5001
HOST=0.0.0.0
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Create the frontend environment file:

```bash
client/.env.local
```

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

The older Vite-style variable also remains supported for compatibility:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

> Never commit real production credentials or secrets to source control.

### 5. Run the app

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Expected local URLs:
- Backend: http://localhost:5001
- Frontend: http://localhost:3000

### Main frontend routes

- `/login` and `/register` for authentication
- `/dashboard` for summaries, calorie insights, scheduled workouts, and the monthly planner
- `/workouts`, `/workouts/new`, and `/workouts/[id]` for workout management and exercise checkpoints
- `/exercises`, `/exercises/new`, and `/exercises/[id]` for exercise library management
- `/nutrition` for nutrition logs
- `/my-account` for profile, security, and preferences
- `/share/workout/[id]` for public shared workouts

---

## Production build and deployment

### Frontend build

```bash
cd client
npm run build
```

The production build runs the Next.js compiler, lint/type validation, route generation, and optimization. The current build has been verified successfully with all application routes generated.

### Frontend production start

```bash
cd client
npm run start
```

The current production start script listens on port 5175 by default:

```bash
next start -p ${PORT:-5175} -H 0.0.0.0
```

### Backend production start

```bash
cd server
npm start
```

---

## Deployment flow

The repository includes a production deploy script at [deploy.sh](deploy.sh). It performs the following checks and actions:

1. verifies the active branch is main
2. ensures the working tree is clean
3. fetches and pulls the latest remote code
4. installs backend production dependencies
5. builds the frontend bundle
6. restarts the backend and frontend Supervisor services
7. validates the backend health endpoint
8. confirms the frontend is responding successfully

The GitHub Actions workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) runs CI validation and deploys to the VPS over SSH.

---

## Health checks

Backend:

```bash
curl http://127.0.0.1:5001/api/health
```

Frontend:

```bash
curl -I http://127.0.0.1:5175/
```

---

## Useful commands

### Client

```bash
cd client
npm install
npm run dev
npm run build
npm run lint
npm run start
```

### Server

```bash
cd server
npm install
npm run dev
npm start
```

---

## Notes

This project has already been migrated from older Vite/React patterns to the current Next.js App Router frontend. The backend remains Express-based and uses MongoDB via Mongoose for data storage. The architecture is intentionally split across client and server folders to match the deploy workflow and live production setup used by this repository.

---

## License

Copyright © 2026 Fahim. All rights reserved.

Unauthorized copying, modification, distribution, or commercial use of this software and its associated documentation files, via any medium, is strictly prohibited.

