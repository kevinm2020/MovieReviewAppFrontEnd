// src/components/UsersChart.jsx
import React, { useEffect, useState } from "react";

export default function UsersChart() {
  const [users, setUsers] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use relative path so dev proxy or backend mapping decides host/port
  const endpoint = "/users";

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    setUsers(null);
    try {
      const res = await fetch(endpoint, { credentials: "same-origin" });
      const ct = (res.headers.get("content-type") || "").toLowerCase();

      if (!res.ok) {
        // try to surface server-side HTML/text for debugging
        const text = await res.text();
        throw new Error(`GET ${endpoint} failed: ${res.status} — ${text.substring(0, 200)}`);
      }

      if (ct.includes("application/json")) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        // response is not JSON (likely HTML error page)
        const text = await res.text();
        throw new Error(`Unexpected response content-type=${ct}. Body: ${text.substring(0, 200)}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: 18, padding: 12, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <strong style={{ fontSize: 16 }}>Registered Users</strong>
          <div style={{ color: "#666", fontSize: 13 }}>Basic list</div>
        </div>

        <div>
          <button onClick={load} disabled={loading} style={smallButtonStyle}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}
      {loading && !users && <div>Loading users…</div>}

      {users && users.length === 0 && <div style={{ color: "#666" }}>No users found</div>}

      {users && users.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 640 }}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Created</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id ?? u.userId ?? JSON.stringify(u).slice(0, 20)}>
                  <td style={tdStyle}>{u.id ?? u.userId ?? "-"}</td>
                  <td style={tdStyle}>{u.username ?? "-"}</td>
                  <td style={tdStyle}>{u.email ?? "-"}</td>
                  <td style={tdStyle}>{u.role ?? "-"}</td>
                  <td style={tdStyle}>{u.status ?? "-"}</td>
                  <td style={tdStyle}>{u.createdAt ?? u.created_at ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = { border: "1px solid #ddd", padding: 8, textAlign: "left", background: "#fafafa" };
const tdStyle = { border: "1px solid #eee", padding: 8 };
const smallButtonStyle = { padding: "6px 10px", borderRadius: 8, border: "1px solid #dfe6ff", background: "#fff", cursor: "pointer", fontWeight: 700 };
