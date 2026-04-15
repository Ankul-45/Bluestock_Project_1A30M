# Bluestock Project 1A30M

India Location SaaS capstone with:
- Node.js + Express + PostgreSQL backend APIs
- New React frontend for Admin + B2B portals (implemented from your requirement screenshots)

## Project Structure

- `index.js` -> Backend API server
- `schema.sql` -> PostgreSQL schema
- `data.py` + CSV/XLSX files -> Data ingestion
- `frontend/` -> React + Vite frontend app

## Frontend Modules Implemented

- Admin Analytics Dashboard
- User Management Features
- State Access Management
- Village Master List (Data Browser)
- B2B Self-Registration
- B2B Usage Dashboard
- API Key Management

## Run Backend

```bash
npm install
node index.js
```

Backend runs on `http://localhost:5000`

## Backend Env (Optional)

Set these before running backend if your DB config is different:

```bash
DB_USER=postgres
DB_HOST=localhost
DB_NAME=india_location_db
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Frontend Env (Optional)

Create `frontend/.env` if you want custom API credentials/base URL:

```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_API_KEY=test123
VITE_API_SECRET=secret123
VITE_B2B_USER_ID=U-1002
```

## Integrated APIs Used By Frontend

- `GET /admin/analytics`
- `GET /admin/users`
- `PATCH /admin/users/:userId/status`
- `POST /admin/users/:userId/notes`
- `POST /admin/users/:userId/state-access`
- `GET /admin/state-access/audit`
- `GET /admin/villages`
- `POST /b2b/register`
- `GET /b2b/dashboard/:userId`
- `GET /b2b/keys/:userId`
- `POST /b2b/keys/:userId`
