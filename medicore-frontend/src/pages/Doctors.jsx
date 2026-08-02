import React, { useEffect, useState } from "react";
import { doctorsApi, patientsApi } from "../api";
import { Btn, Badge, Card, Modal, Field, Input, Table, SearchBox, Alert, Spinner } from "../components/UI";

const EMPTY = { name: "", specialization: "", email: "", phone: "", salary: "" };

const SPECS = [
  "Cardiology","Neurology","Orthopedics","Pediatrics","Surgery",
  "Dermatology","Gynecology","Endocrinology","Radiology","Psychiatry",
  "Oncology","Urology","Ophthalmology","ENT","General Medicine",
];

export default function Doctors() {
  const [doctors,  setDoctors]  = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);
  const [saving,   setSaving]   = useState(false);

  const load = () =>
    Promise.all([doctorsApi.getAll(), patientsApi.getAll()])
      .then(([d, p]) => { setDoctors(d); setPatients(p); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (d) => {
    setForm({ name: d.name, specialization: d.specialization, email: d.email, phone: d.phone || "", salary: d.salary });
    setEditId(d.id); setModal(true);
  };

  const save = async () => {
    if (!form.name || !form.specialization || !form.email) return setError("Name, specialization, and email are required.");
    setSaving(true); setError("");
    try {
      const payload = { ...form, salary: form.salary ? Number(form.salary) : 0 };
      if (editId) await doctorsApi.update(editId, payload);
      else        await doctorsApi.create(payload);
      setModal(false); setSuccess(editId ? "Doctor updated." : "Doctor added."); load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    const count = patients.filter(p => p.doctor_id === id).length;
    if (count > 0 && !window.confirm(`This doctor has ${count} patient(s). Remove anyway?`)) return;
    else if (count === 0 && !window.confirm("Remove this doctor?")) return;
    try { await doctorsApi.delete(id); setSuccess("Doctor removed."); load(); }
    catch (e) { setError(e.message); }
  };

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const patientCount = (id) => patients.filter(p => p.doctor_id === id).length;

  const columns = [
    { key: "name",           label: "Name",            width: "22%", render: d => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--accent-t)", flexShrink: 0 }}>
          {d.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
        </div>
        <strong>{d.name}</strong>
      </div>
    )},
    { key: "specialization", label: "Specialization",  width: "18%", render: d => <Badge color="blue">{d.specialization}</Badge> },
    { key: "email",          label: "Email",           width: "22%", render: d => <span style={{ color: "var(--text2)", fontSize: 12 }}>{d.email}</span> },
    { key: "phone",          label: "Phone",           width: "15%", render: d => <span style={{ color: "var(--text3)" }}>{d.phone || "—"}</span> },
    { key: "salary",         label: "Salary",          width: "10%", render: d => <span style={{ fontSize: 12 }}>Rs {Number(d.salary).toLocaleString()}</span> },
    { key: "patients",       label: "Patients",        width: "7%",  render: d => <Badge color="default">{patientCount(d.id)}</Badge> },
    { key: "actions",        label: "",                width: "6%",
      render: d => (
        <div style={{ display: "flex", gap: 6 }}>
          <Btn style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => openEdit(d)}>Edit</Btn>
          <Btn variant="danger" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => remove(d.id)}>Del</Btn>
        </div>
      )
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Doctors</h1>
          <p style={{ color: "var(--text3)", fontSize: 13 }}>{doctors.length} doctors registered</p>
        </div>
        <Btn variant="primary" onClick={openAdd}>+ Add doctor</Btn>
      </div>

      {error   && <Alert message={error}   onClose={() => setError("")} />}
      {success && <Alert message={success} onClose={() => setSuccess("")} />}

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <SearchBox value={search} onChange={setSearch} placeholder="Search by name or specialization…" />
          <span style={{ fontSize: 12, color: "var(--text3)" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <Table columns={columns} rows={filtered} emptyText="No doctors found." />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? "Edit doctor" : "Add doctor"}>
        {error && <Alert message={error} onClose={() => setError("")} />}
        <Field label="Full name *">
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dr. Full Name" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Specialization *">
            <input
              list="specs-list"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--surface2)", color: "var(--text)", fontSize: 13 }}
              value={form.specialization}
              onChange={e => setForm({ ...form, specialization: e.target.value })}
              placeholder="e.g. Cardiology"
            />
            <datalist id="specs-list">
              {SPECS.map(s => <option key={s} value={s} />)}
            </datalist>
          </Field>
          <Field label="Salary (Rs)">
            <Input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="0" min={0} />
          </Field>
        </div>
        <Field label="Email *">
          <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="doctor@hospital.com" />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+92 300 000 0000" />
        </Field>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <Btn onClick={() => setModal(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={save} disabled={saving}>{saving ? "Saving…" : editId ? "Save changes" : "Add doctor"}</Btn>
        </div>
      </Modal>
    </div>
  );
}
