# 🏥 Hospital Management System — Current State

A full-stack Hospital Management System built with **FastAPI** (backend) and **React** (frontend).

> ⚠️ **Note:** Authentication is NOT implemented yet. All API endpoints are currently open/unprotected.

---

## 🚀 Tech Stack

### Backend
- **FastAPI** — Python web framework
- **SQLAlchemy** — ORM for database management
- **Alembic** — Database migrations
- **MySQL** — Relational database
- **PyMySQL** — MySQL connector
- **Pydantic** — Data validation

### Frontend
- **React 18** — UI framework
- **React Router v6** — Page navigation
- **Fetch API** — Connects frontend to backend

---

## 📁 Project Structure

```
hospital-management-system/
│
├── alembic/                        ← Database migration files
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
│
├── app/                            ← FastAPI backend
│   ├── core/
│   │   └── security.py             ← Placeholder (not implemented yet)
│   │
│   ├── crud/                       ← Database operations
│   │   ├── doctor.py
│   │   ├── patient.py
│   │   └── staff.py
│   │
│   ├── models/                     ← SQLAlchemy table definitions
│   │   ├── doctor.py
│   │   ├── patient.py
│   │   └── staff.py
│   │
│   ├── routes/                     ← API endpoints
│   │   ├── doctor.py
│   │   ├── patient.py
│   │   └── staff.py
│   │
│   ├── schemas/                    ← Pydantic request/response models
│   │   ├── doctor.py
│   │   ├── patient.py
│   │   └── staff.py
│   │
│   ├── config.py                   ← App settings & DB URL
│   ├── database.py                 ← SQLAlchemy engine & session
│   └── main.py                     ← FastAPI app entry point
│
├── medicore-frontend/              ← React frontend
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js            ← All API calls to FastAPI
│   │   │
│   │   ├── components/
│   │   │   ├── Sidebar.jsx         ← Left navigation
│   │   │   └── UI.jsx              ← Reusable components (Button, Modal, Table, Badge)
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       ← Stats overview, recent patients, shift chart
│   │   │   ├── Patients.jsx        ← Full CRUD for patients
│   │   │   ├── Doctors.jsx         ← Full CRUD for doctors
│   │   │   └── Staff.jsx           ← Full CRUD for staff
│   │   │
│   │   ├── App.jsx                 ← Router + layout
│   │   ├── index.js                ← Entry point
│   │   └── index.css               ← Global CSS variables + reset
│   │
│   ├── .env                        ← Frontend environment variables
│   ├── .env.example                ← Template for .env
│   └── package.json
│
├── .env                            ← Backend environment variables
├── .env.example                    ← Template for backend .env
├── alembic.ini
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation & Setup

### Step 1 — Clone the Repository
```bash
git clone https://github.com/vishalsahilai/hospital-management-system.git
cd hospital-management-system
```

### Step 2 — Backend Setup

**Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

**Install requirements:**
```bash
pip install -r requirements.txt
```

**Create `.env` file:**
```env
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hospital_db
```

**Create MySQL database:**
```sql
CREATE DATABASE hospital_db;
```

**Add this to `app/main.py`** (creates tables automatically on startup):
```python
from app.database import Base, engine
from app.models import doctor, patient, staff

Base.metadata.create_all(bind=engine)
```

**Add CORS middleware to `app/main.py`:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Start the backend:**
```bash
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`
Swagger docs at: `http://localhost:8000/docs`

---

### Step 3 — Frontend Setup

```bash
cd medicore-frontend
```

**Create `.env` file:**
```bash
cp .env.example .env
```

Contents of `.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

**Install dependencies:**
```bash
npm install
```

**Start the frontend:**
```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 📋 Current API Endpoints

> ⚠️ All endpoints are currently **unprotected** — no authentication required.

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctor/` | Get all doctors |
| POST | `/doctor/` | Add new doctor |
| GET | `/doctor/{id}` | Get doctor by ID |
| PUT | `/doctor/{id}` | Update doctor |
| DELETE | `/doctor/{id}` | Delete doctor |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patient/` | Get all patients |
| POST | `/patient/` | Add new patient |
| GET | `/patient/{id}` | Get patient by ID |
| PUT | `/patient/{id}` | Update patient |
| DELETE | `/patient/{id}` | Delete patient |

### Staff
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/staff/` | Get all staff |
| POST | `/staff/` | Add new staff member |
| GET | `/staff/{id}` | Get staff by ID |
| PUT | `/staff/{id}` | Update staff member |
| DELETE | `/staff/{id}` | Delete staff member |

---

## 🖥️ Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Stats overview, recent patients, doctor list, shift chart |
| Patients | `/patients` | Add, edit, delete, search patients |
| Doctors | `/doctors` | Add, edit, delete, search doctors |
| Staff | `/staff` | Add, edit, delete, search staff members |

---

## ✅ What's Working

- [x] MySQL database connection
- [x] SQLAlchemy models (Doctor, Patient, Staff)
- [x] Pydantic schemas for validation
- [x] Full CRUD operations (Create, Read, Update, Delete)
- [x] REST API routes for all 3 modules
- [x] Auto table creation on startup
- [x] CORS enabled for React frontend
- [x] React frontend with 4 pages
- [x] Add/Edit/Delete modals with forms
- [x] Search/filter on all pages
- [x] Dashboard with live stats
- [x] Swagger UI at `/docs`

## ❌ What's NOT Done Yet

- [ ] JWT Authentication
- [ ] User login / register
- [ ] Protected API routes
- [ ] Role based access control
- [ ] Frontend login page
- [ ] Auto logout

---

## 🛠️ Requirements

```
fastapi
uvicorn
sqlalchemy
alembic
pydantic
pydantic-settings
pymysql
python-dotenv
python-jose[cryptography]
passlib[bcrypt]
python-multipart
```

---

## 👨‍💻 Developer

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

**Vishal Sahil**
- GitHub: [@vishalsahilai](https://github.com/vishalsahilai)

---

## 📄 License

This project is for educational purposes — Saylani Mass IT Training.