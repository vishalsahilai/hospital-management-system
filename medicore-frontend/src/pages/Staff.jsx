import React, { useEffect, useState } from "react";
import { staffApi } from "../api";
import { Btn, Badge, Card, Modal, Field, Input, Select, Table, SearchBox, Alert, Spinner } from "../components/UI";

const shiftColor = { Morning: "green", Evening: "orange", Night: "blue" };
const EMPTY = { name: "", role: "", shift: "Morning", salary: "" };

const ROLES = [
  "Head Nurse","Nurse","Senior Nurse","Receptionist","Lab Technician",
  "Pharmacist","Radiologist","Physiotherapist","Ward Boy","Cleaner",
  "Security Guard","Administrator","IT Support",
];

export default function Staff() {
  const [staff,   setStaff]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [saving,  setSaving]  = useState(false);

  const load = () =>
    staffApi.getAll()
      .then(setStaff)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (s) => {
    setForm({ name: s.name, role: s.role, shift: s.shift, salary: s.salary });
    setEditId(s.id); setModal(true);
  };

  const save = async () => {
    if (!form.name || !form.role || !form.shift) return setError("Name, role, and shift are required.");
    setSaving(true); setError("");
    try {
      const payload = { ...form, salary: form.salary ? Number(form.salary) : 0 };
      if (editId) await staffApi.update(editId, payload);
      else        await staffApi.create(payload);
      setModal(false); setSuccess(editId ? "Staff member updated." : "Staff member added."); load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this staff member?")) return;
    try { await staffApi.delete(id); setSuccess("Staff member removed."); load(); }
    catch (e) { setError(e.message); }
  };

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.shift.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const shiftStats = staff.reduce((acc, s) => { acc[s.shift] = (acc[s.shift] || 0) + 1; return acc; }, {});
  const avgSalary  = staff.length ? Math.round(staff.reduce((a, s) => a + s.salary, 0) / staff.length) : 0;

  const columns = [
    { key: "name",   label: "Name",   width: "28%", render: s => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f5f0ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#7c3aed", flexShrink: 0 }}>
          {s.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
        </div>
        <strong>{s.name}</strong>
      </div>
    )},
    { key: "role",   label: "Role",   width: "25%", render: s => <span style={{ color: "var(--text2)" }}>{s.role}</span> },
    { key: "shift",  label: "Shift",  width: "15%", render: s => <Badge color={shiftColor[s.shift] || "default"}>{s.shift}</Badge> },
    { key: "salary", label: "Salary", width: "15%", render: s => <span style={{ fontSize: 12 }}>Rs {Number(s.salary).toLocaleString()}</span> },
    { key: "actions", label: "",      width: "17%",
      render: s => (
        <div style={{ display: "flex", gap: 6 }}>
          <Btn style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => openEdit(s)}>Edit</Btn>
          <Btn variant="danger" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => remove(s.id)}>Del</Btn>
        </div>
      )
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Staff</h1>
          <p style={{ color: "var(--text3)", fontSize: 13 }}>{staff.length} members across all shifts</p>
        </div>
        <Btn variant="primary" onClick={openAdd}>+ Add staff member</Btn>
      </div>

      {error   && <Alert message={error}   onClose={() => setError("")} />}
      {success && <Alert message={success} onClose={() => setSuccess("")} />}

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Morning shift", value: shiftStats.Morning || 0, color: "#16a34a" },
          { label: "Evening shift", value: shiftStats.Evening || 0, color: "#d97706" },
          { label: "Night shift",   value: shiftStats.Night   || 0, color: "#2563eb" },
          { label: "Avg. salary",   value: `Rs ${avgSalary.toLocaleString()}`, color: "var(--text2)", small: true },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: s.small ? 16 : 22, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <SearchBox value={search} onChange={setSearch} placeholder="Search by name, role, or shift…" />
          <span style={{ fontSize: 12, color: "var(--text3)" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <Table columns={columns} rows={filtered} emptyText="No staff members found." />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? "Edit staff member" : "Add staff member"}>
        {error && <Alert message={error} onClose={() => setError("")} />}
        <Field label="Full name *">
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Staff name" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Role *">
            <input
              list="roles-list"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--surface2)", color: "var(--text)", fontSize: 13 }}
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Nurse"
            />
            <datalist id="roles-list">
              {ROLES.map(r => <option key={r} value={r} />)}
            </datalist>
          </Field>
          <Field label="Shift *">
            <Select value={form.shift} onChange={e => setForm({ ...form, shift: e.target.value })}>
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
            </Select>
          </Field>
        </div>
        <Field label="Salary (Rs)">
          <Input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="0" min={0} />
        </Field>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <Btn onClick={() => setModal(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={save} disabled={saving}>{saving ? "Saving…" : editId ? "Save changes" : "Add staff member"}</Btn>
        </div>
      </Modal>
    </div>
  );
}
