import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Patients  from "./pages/Patients";
import Doctors   from "./pages/Doctors";
import Staff     from "./pages/Staff";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxHeight: "100vh" }}>
          <Routes>
            <Route path="/"         element={<Dashboard />} />
            <Route path="/patients" element={<Patients />}  />
            <Route path="/doctors"  element={<Doctors />}   />
            <Route path="/staff"    element={<Staff />}     />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
