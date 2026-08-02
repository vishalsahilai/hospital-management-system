import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/",         label: "Dashboard",  icon: "⊞" },
  { to: "/patients", label: "Patients",   icon: "👥" },
  { to: "/doctors",  label: "Doctors",    icon: "🩺" },
  { to: "/staff",    label: "Staff",      icon: "🪪" },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: 220, minWidth: 220, height: "100vh", position: "sticky", top: 0,
      background: "#fff", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: "var(--accent-bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "var(--accent-t)",
          }}>❤</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>MediCore</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>Hospital System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".08em", padding: "8px 8px 4px" }}>
          Main
        </div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 9,
              padding: "7px 10px", borderRadius: 8, marginBottom: 2,
              fontSize: 13.5, fontWeight: isActive ? 500 : 400,
              color: isActive ? "var(--accent-t)" : "var(--text2)",
              background: isActive ? "var(--accent-bg)" : "transparent",
              textDecoration: "none", transition: "all .12s",
            })}
          >
            <span style={{ fontSize: 15 }}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", background: "var(--success-bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 600, color: "var(--success)",
          }}>AD</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Admin</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
