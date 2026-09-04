# Community Pet and Stray Animal Management System — Backend

Express + Sequelize + MySQL API covering: user accounts, pet registration
(with QR code + expiry), stray/lost/found reporting, the color-coded
temperament sighting-report path, and the officials' dashboard.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a MySQL database:
   ```sql
   CREATE DATABASE pet_management_system;
   ```

3. Copy `.env.example` to `.env` and fill in your MySQL credentials and a
   JWT secret:
   ```bash
   cp .env.example .env
   ```

4. Start the server (tables are auto-created/synced on boot):
   ```bash
   npm run dev     # with nodemon, auto-restart on changes
   # or
   npm start
   ```

Server runs on `http://localhost:5000` by default. Health check:
`GET /api/health`.

> Note: `sequelize.sync({ alter: true })` in `server.js` is fine for
> development. For production, switch to Sequelize migrations instead.

## Project structure

```
config/database.js        Sequelize MySQL connection
models/                    User, Pet, Report, ReportStatusLog, SightingReport
controllers/                Business logic for each module
routes/                     Express route definitions
middleware/auth.js          JWT verification
middleware/roleCheck.js     Role-based access control
utils/qrGenerator.js        QR code generation for pets
utils/expiry.js             Expiry-date calculation + daily cron job
utils/priority.js           Sighting-report priority logic (temperament -> priority)
app.js                      Express app + route mounting
server.js                   DB connection, sync, cron schedule, server start
```

## Roles

`resident`, `pet_owner`, `barangay_official`, `admin`, `volunteer`.
Self-registration via `/api/auth/register` only allows `resident`,
`pet_owner`, or `volunteer` — assign `barangay_official`/`admin` manually
in the database for trusted staff accounts.

## API reference

### Auth (`/api/auth`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create account |
| POST | `/login` | Public | Get JWT token |
| GET | `/me` | Auth | Current user profile |

### Pets (`/api/pets`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/lookup/:qrId` | Public | Scan result — pet + limited owner info |
| POST | `/` | Auth | Register a pet (auto QR + expiry) |
| GET | `/mine` | Auth | List my pets |
| PUT | `/:id/renew` | Auth (owner/admin) | Renew expiring registration |
| GET | `/` | Staff | List all pets, `?status=active` filter |
| PUT | `/:id/temperament` | Staff | Correct a pet's temperament tag |

### Reports (`/api/reports`) — stray / lost / found
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | Auth | Submit a report (`reportType`: stray/lost/found) |
| GET | `/` | Auth | List reports (own, or all if staff); filters `?reportType=&status=` |
| GET | `/:id` | Auth | Report detail + status history |
| PUT | `/:id/status` | Staff | Update status, logs to timeline |

### Sighting reports (`/api/sightings`) — no-scan path for red/yellow-tagged animals
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | Auth | Submit a sighting (`temperamentObserved`: green/yellow/red) — priority auto-derived |
| GET | `/queue` | Staff | Priority-sorted queue (high first) |
| PUT | `/:id/status` | Staff | Update status (new -> forwarded_to_barangay -> handled) |

### Dashboard (`/api/dashboard`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/overview` | Staff | Pet/report/sighting counts for the admin dashboard |

## Notes / next steps

- **File uploads**: `photoUrl` fields currently expect a URL string. Wire
  up `multer` (already in `package.json`) + local disk or S3-style storage
  if you want direct image upload instead of a pre-hosted URL.
- **QR scan-location logging**: not included here — see the earlier
  discussion on a `qr_scan_logs` table if you want to log where/when a
  QR was scanned and show it on a map.
- **Frontend**: this is backend-only. Pair it with a React/Vue client or
  a mobile app calling these REST endpoints.
