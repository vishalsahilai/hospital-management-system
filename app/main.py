from fastapi import FastAPI
from app.routes import doctor_router, patient_router, staff_router
from app.database import Base, engine
from app.models import doctor, patient, staff

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hospital Management System",
    description="API for managing doctors, patients and staff",
    version="1.0.0"
)

app.include_router(doctor_router)
app.include_router(patient_router)
app.include_router(staff_router)


@app.get("/")
def root():
    return {"message": "Hospital Management System API is running"}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)