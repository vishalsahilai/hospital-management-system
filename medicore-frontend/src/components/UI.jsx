import React from "react";

//  BUTTON 
const btnBase = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
  border: "1px solid", transition: "all .15s", lineHeight: 1,
};
export function Btn({ variant = "default", children, style, ...props }) {
  const styles = {
    default: { background: "#fff", borderColor: "var(--border2)", color: "var(--text)" },
    primary: { background: "var(--accent)", borderColor: "var(--accent)", color: "#fff" },
    danger:  { background: "var(--danger-bg)", borderColor: "var(--danger)", color: "var(--danger)" },
    ghost:   { background: "transparent", borderColor: "transparent", color: "var(--text2)" },
  };
  return (
    <button style={{ ...btnBase, ...styles[variant], ...style }} {...props}>
      {children}
    </button>
  );
}

//  BADGE 
export function Badge({ color = "default", children }) {
  const colors = {
    default: { background: "var(--bg)", color: "var(--text2)", border: "1px solid var(--border)" },
    blue:    { background: "var(--accent-bg)", color: "var(--accent-t)", border: "none" },
    green:   { background: "var(--success-bg)", color: "var(--success)", border: "none" },
    orange:  { background: "var(--warning-bg)", color: "var(--warning)", border: "none" },
    red:     { background: "var(--danger-bg)", color: "var(--danger)", border: "none" },
  };
  return (
    <span style={{
      display: "inline-block", padding: "2px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 500, ...colors[color],
    }}>
      {children}
    </span>
  );
}

// CARD 
export function Card({ children, style }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "16px 20px", boxShadow: "var(--shadow)", ...style,
    }}>
      {children}
    </div>
  );
}

//  STAT CARD 
export function StatCard({ label, value, icon, color = "blue" }) {
  const colors = {
    blue:   { bg: "var(--accent-bg)", color: "var(--accent-t)" },
    green:  { bg: "var(--success-bg)", color: "var(--success)" },
    orange: { bg: "var(--warning-bg)", color: "var(--warning)" },
    red:    { bg: "var(--danger-bg)", color: "var(--danger)" },
  };
  const c = colors[color];
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: c.bg, color: c.color,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1, color: "var(--text)" }}>{value}</div>
      </div>
    </Card>
  );
}

//  MODAL 
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--surface)", borderRadius: 14, padding: "22px 24px",
          width: 440, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,.2)",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>{title}</span>
          <Btn variant="ghost" onClick={onClose} style={{ padding: "4px 8px", fontSize: 18 }}>✕</Btn>
        </div>
        {children}
      </div>
    </div>
  );
}

//  FORM FIELD 
export function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      <label style={{ display: "block", fontSize: 12, color: "var(--text2)", marginBottom: 5, fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 10px", borderRadius: 8,
  border: "1px solid var(--border2)", background: "var(--surface2)",
  color: "var(--text)", fontSize: 13, outline: "none",
};

export function Input({ ...props }) {
  return <input style={inputStyle} {...props} />;
}

export function Select({ children, ...props }) {
  return <select style={inputStyle} {...props}>{children}</select>;
}

//  SEARCH BOX 
export function SearchBox({ value, onChange, placeholder }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "7px 12px",
      border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface)",
      width: 240,
    }}>
      <span style={{ color: "var(--text3)", fontSize: 15 }}>⌕</span>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "Search…"}
        style={{ border: "none", background: "none", outline: "none", fontSize: 13, width: "100%", color: "var(--text)" }}
      />
    </div>
  );
}

//  TABLE 
export function Table({ columns, rows, emptyText = "No records found" }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{
                textAlign: "left", fontSize: 11, fontWeight: 500,
                color: "var(--text3)", padding: "0 0 10px",
                borderBottom: "1px solid var(--border)",
                width: col.width,
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div style={{ textAlign: "center", padding: "36px 0", color: "var(--text3)", fontSize: 14 }}>
                  {emptyText}
                </div>
              </td>
            </tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
              {columns.map(col => (
                <td key={col.key} style={{ padding: "11px 0", fontSize: 13, verticalAlign: "middle" }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

//  ALERT 
export function Alert({ type = "danger", message, onClose }) {
  if (!message) return null;
  const s = { danger: { bg: "var(--danger-bg)", color: "var(--danger)" } };
  const c = s[type] || s.danger;
  return (
    <div style={{
      background: c.bg, color: c.color, border: `1px solid ${c.color}30`,
      borderRadius: 8, padding: "10px 14px", fontSize: 13,
      display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16,
    }}>
      <span>{message}</span>
      {onClose && <button onClick={onClose} style={{ background: "none", border: "none", color: c.color, cursor: "pointer", fontSize: 16 }}>✕</button>}
    </div>
  );
}

//  SPINNER 
export function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
      <div style={{
        width: 28, height: 28, border: "3px solid var(--border)",
        borderTopColor: "var(--accent)", borderRadius: "50%",
        animation: "spin .7s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
