import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doctorsApi, patientsApi, staffApi } from "../api";
import { StatCard, Card, Badge, Spinner, Alert } from "../components/UI";

const shiftColor = { Morning: "green", Evening: "orange", Night: "blue" };
const genderColor = { Male: "blue", Female: "orange", Other: "default" };

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors]   = useState([]);
  const [staff, setStaff]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    Promise.all([patientsApi.getAll(), doctorsApi.getAll(), staffApi.getAll()])
      .then(([p, d, s]) => { setPatients(p); setDoctors(d); setStaff(s); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = patients.filter(p => p.admission_date === today).length;
  const specs = [...new Set(doctors.map(d => d.specialization))];
  const shiftCounts = staff.reduce((acc, s) => { acc[s.shift] = (acc[s.shift] || 0) + 1; return acc; }, {});
  const recentPatients = [...patients].sort((a, b) => b.admission_date.localeCompare(a.admission_date)).slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Dashboard</h1>
        <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 3 }}>
          {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {error && <Alert message={error} onClose={() => setError("")} />}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard label="Total patients"   value={patients.length} icon="👥" color="blue" />
        <StatCard label="Doctors on staff" value={doctors.length}  icon="🩺" color="green" />
        <StatCard label="Staff members"    value={staff.length}    icon="🪪" color="orange" />
        <StatCard label="Admitted today"   value={todayCount}      icon="📋" color="red" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Recent Patients */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Recent patients</span>
            <Link to="/patients" style={{ fontSize: 12, color: "var(--accent)" }}>View all →</Link>
          </div>
          {recentPatients.length === 0 ? (
            <p style={{ color: "var(--text3)", fontSize: 13 }}>No patients yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Name", "Disease", "Gender", "Admitted"].map(h => (
                    <th key={h} style={{ textAlign: "left", fontSize: 11, color: "var(--text3)", fontWeight: 500, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPatients.map(p => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "9px 0", fontWeight: 500, fontSize: 13 }}>{p.name}</td>
                    <td style={{ fontSize: 12, color: "var(--text2)", maxWidth: 120 }}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.disease}
                      </span>
                    </td>
                    <td><Badge color={genderColor[p.gender] || "default"}>{p.gender}</Badge></td>
                    <td style={{ fontSize: 12, color: "var(--text3)" }}>{p.admission_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Doctors */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Doctors</span>
            <Link to="/doctors" style={{ fontSize: 12, color: "var(--accent)" }}>View all →</Link>
          </div>
          {doctors.length === 0 ? (
            <p style={{ color: "var(--text3)", fontSize: 13 }}>No doctors yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {doctors.slice(0, 5).map(d => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", background: "var(--accent-bg)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 600, color: "var(--accent-t)", flexShrink: 0,
                  }}>
                    {d.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{d.specialization}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text3)", whiteSpace: "nowrap" }}>
                    {patients.filter(p => p.doctor_id === d.id).length} patients
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Specializations */}
        <Card>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Specializations</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {specs.length === 0
              ? <p style={{ color: "var(--text3)", fontSize: 13 }}>No doctors added yet.</p>
              : specs.map(s => <Badge key={s} color="blue">{s}</Badge>)}
          </div>
        </Card>

        {/* Staff by shift */}
        <Card>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Staff by shift</div>
          <div style={{ display: "flex", gap: 12 }}>
            {["Morning", "Evening", "Night"].map(sh => (
              <div key={sh} style={{
                flex: 1, background: "var(--surface2)", borderRadius: 10,
                padding: "12px", textAlign: "center", border: "1px solid var(--border)",
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{shiftCounts[sh] || 0}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{sh}</div>
                <div style={{ marginTop: 8 }}><Badge color={shiftColor[sh]}>{sh}</Badge></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
