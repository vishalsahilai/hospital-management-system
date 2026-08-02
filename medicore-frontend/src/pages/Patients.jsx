import React, { useEffect, useState } from "react";
import { patientsApi, doctorsApi } from "../api";
import { Btn, Badge, Card, Modal, Field, Input, Select, Table, SearchBox, Alert, Spinner } from "../components/UI";

const genderColor = { Male: "blue", Female: "orange", Other: "default" };
const EMPTY = { name: "", age: "", gender: "Male", disease: "", doctor_id: "", admission_date: "" };

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [doctors,  setDoctors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);
  const [saving,   setSaving]   = useState(false);

  const load = () =>
    Promise.all([patientsApi.getAll(), doctorsApi.getAll()])
      .then(([p, d]) => { setPatients(p); setDoctors(d); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, age: p.age, gender: p.gender, disease: p.disease, doctor_id: p.doctor_id, admission_date: p.admission_date });
    setEditId(p.id); setModal(true);
  };

  const save = async () => {
    if (!form.name || !form.age || !form.disease || !form.doctor_id || !form.admission_date)
      return setError("Please fill all required fields.");
    setSaving(true); setError("");
    try {
      const payload = { ...form, age: Number(form.age), doctor_id: Number(form.doctor_id) };
      if (editId) await patientsApi.update(editId, payload);
      else        await patientsApi.create(payload);
      setModal(false); setSuccess(editId ? "Patient updated." : "Patient added."); load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this patient?")) return;
    try { await patientsApi.delete(id); setSuccess("Patient removed."); load(); }
    catch (e) { setError(e.message); }
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.disease.toLowerCase().includes(search.toLowerCase())
  );

  const doctorName = (id) => doctors.find(d => d.id === id)?.name || "—";

  const columns = [
    { key: "name",           label: "Name",           width: "20%", render: p => <strong>{p.name}</strong> },
    { key: "age",            label: "Age",            width: "7%"  },
    { key: "gender",         label: "Gender",         width: "10%", render: p => <Badge color={genderColor[p.gender]}>{p.gender}</Badge> },
    { key: "disease",        label: "Disease",        width: "22%" },
    { key: "doctor", label: "Doctor", width: "20%", render: p => {const doc = doctors.find(d => d.id === p.doctor_id);return <span style={{ color: "var(--text2)" }}>{doc ? `${doc.name} — ${doc.specialization}` : "—"}</span>;}},
    { key: "admission_date", label: "Admitted",       width: "14%", render: p => <span style={{ color: "var(--text3)", fontSize: 12 }}>{p.admission_date}</span> },
    { key: "actions",        label: "",               width: "7%",
      render: p => (
        <div style={{ display: "flex", gap: 6 }}>
          <Btn style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => openEdit(p)}>Edit</Btn>
          <Btn variant="danger" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => remove(p.id)}>Del</Btn>
        </div>
      )
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Patients</h1>
          <p style={{ color: "var(--text3)", fontSize: 13 }}>{patients.length} total records</p>
        </div>
        <Btn variant="primary" onClick={openAdd}>+ Add patient</Btn>
      </div>

      {error   && <Alert message={error}   onClose={() => setError("")} />}
      {success && <Alert type="danger" message={success} onClose={() => setSuccess("")} style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success)30" }} />}

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <SearchBox value={search} onChange={setSearch} placeholder="Search by name or disease…" />
          <span style={{ fontSize: 12, color: "var(--text3)" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <Table columns={columns} rows={filtered} emptyText="No patients match your search." />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? "Edit patient" : "Add patient"}>
        {error && <Alert message={error} onClose={() => setError("")} />}
        <Field label="Full name *">
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Patient name" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Age *">
            <Input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Age" min={0} max={150} />
          </Field>
          <Field label="Gender *">
            <Select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
          </Field>
        </div>
        <Field label="Disease / condition *">
          <Input value={form.disease} onChange={e => setForm({ ...form, disease: e.target.value })} placeholder="Diagnosis or condition" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Attending doctor *">
            <Select value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: e.target.value })}>
              <option value="">Select doctor…</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
            </Select>
          </Field>
          <Field label="Admission date *">
            <Input type="date" value={form.admission_date} onChange={e => setForm({ ...form, admission_date: e.target.value })} />
          </Field>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <Btn onClick={() => setModal(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={save} disabled={saving}>{saving ? "Saving…" : editId ? "Save changes" : "Add patient"}</Btn>
        </div>
      </Modal>
    </div>
  );
}
