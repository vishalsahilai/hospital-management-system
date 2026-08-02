// API BASE URL 
// Change this to your FastAPI server address if different
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

//DOCTORS
export const doctorsApi = {
  getAll: () => request("/doctor/"),
  getOne: (id) => request(`/doctor/${id}`),
  create: (data) => request("/doctor/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/doctor/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/doctor/${id}`, { method: "DELETE" }),
};

//PATIENTS
export const patientsApi = {
  getAll: () => request("/patient/"),
  getOne: (id) => request(`/patient/${id}`),
  create: (data) => request("/patient/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/patient/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/patient/${id}`, { method: "DELETE" }),
};

//  STAFF 
export const staffApi = {
  getAll: () => request("/staff/"),
  getOne: (id) => request(`/staff/${id}`),
  create: (data) => request("/staff/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/staff/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/staff/${id}`, { method: "DELETE" }),
};
