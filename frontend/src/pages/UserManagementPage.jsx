import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { addAdminUserNote, getAdminUsers, updateAdminUserStatus } from "../services/api";

const statusOptions = ["All", "Pending", "Active", "Suspended"];
const planOptions = ["All", "Free", "Premium", "Pro", "Unlimited"];

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [plan, setPlan] = useState("All");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [note, setNote] = useState("");
  const [sortBy, setSortBy] = useState("registrationDate");
  const [message, setMessage] = useState("");

  const fetchUsers = () => {
    getAdminUsers({ search, status, plan, sortBy })
      .then((result) => {
        setUsers(result);
        if (!selectedUserId && result.length > 0) {
          setSelectedUserId(result[0].id);
        }
      })
      .catch(() => {
        setMessage("Could not fetch users from backend.");
      });
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, plan, sortBy]);

  useEffect(() => {
    if (users.length > 0 && !users.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId]);

  const selectedUser = useMemo(() => users.find((user) => user.id === selectedUserId) || users[0], [selectedUserId, users]);

  const requestHistory = selectedUser
    ? [
        { day: "2026-04-15", endpoint: "/search", count: Math.round(selectedUser.requestCount * 0.42) },
        { day: "2026-04-14", endpoint: "/subdistricts/:id/villages", count: Math.round(selectedUser.requestCount * 0.31) },
        { day: "2026-04-13", endpoint: "/states/:id/districts", count: Math.round(selectedUser.requestCount * 0.17) },
        { day: "2026-04-12", endpoint: "/states", count: Math.round(selectedUser.requestCount * 0.1) },
      ]
    : [];

  const changeStatus = (nextStatus) => {
    if (!selectedUser) return;
    updateAdminUserStatus(selectedUser.id, nextStatus)
      .then(() => {
        setMessage(`Status updated to ${nextStatus}`);
        fetchUsers();
      })
      .catch(() => setMessage("Status update failed."));
  };

  const saveNote = () => {
    if (!selectedUser || !note.trim()) return;
    addAdminUserNote(selectedUser.id, note)
      .then(() => {
        setMessage("Note saved.");
        setNote("");
        fetchUsers();
      })
      .catch(() => setMessage("Could not save note."));
  };

  return (
    <AppShell portal="admin" title="User Management Features">
      <section className="panel">
        <h3>User List View</h3>
        <div className="controls-grid">
          <input
            type="search"
            placeholder="Search by email, business name, or API key"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select value={plan} onChange={(event) => setPlan(event.target.value)}>
            {planOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="registrationDate">Sort: Registration Date</option>
            <option value="lastActive">Sort: Last Active</option>
            <option value="requestCount">Sort: Request Count</option>
          </select>
        </div>

        <div className="bulk-row">
          <button type="button" onClick={() => changeStatus("Active")}>
            Approve
          </button>
          <button type="button" onClick={() => changeStatus("Suspended")}>
            Suspend
          </button>
          <button type="button" className="danger" onClick={() => setMessage("Delete action is not enabled in this demo API") }>
            Delete
          </button>
        </div>

        {message && <p className="panel-copy">{message}</p>}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Business</th>
                <th>Email</th>
                <th>Status</th>
                <th>Plan</th>
                <th>Last Active</th>
                <th>Requests</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={selectedUser?.id === user.id ? "active-row" : ""}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <td>{user.id}</td>
                  <td>{user.businessName}</td>
                  <td>{user.businessEmail}</td>
                  <td>
                    <span className={`status ${user.status.toLowerCase()}`}>{user.status}</span>
                  </td>
                  <td>{user.plan}</td>
                  <td>{user.lastActive}</td>
                  <td>{user.requestCount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser && (
        <section className="panel">
          <h3>User Detail View</h3>
          <div className="detail-grid">
            <article>
              <h4>Profile</h4>
              <p>{selectedUser.businessName}</p>
              <p>{selectedUser.businessEmail}</p>
              <p>{selectedUser.phone}</p>
              <p>GST: {selectedUser.gst}</p>
            </article>
            <article>
              <h4>Plan and Usage</h4>
              <p>Plan: {selectedUser.plan}</p>
              <p>Request count: {selectedUser.requestCount.toLocaleString()}</p>
              <p>Last active: {selectedUser.lastActive}</p>
            </article>
            <article>
              <h4>State Access Matrix</h4>
              <p>{selectedUser.statesAllowed.join(", ") || "No access assigned"}</p>
            </article>
            <article>
              <h4>API Keys Management</h4>
              <p>Current keys: {selectedUser.keys}</p>
              <div className="inline-buttons">
                <button type="button">Create</button>
                <button type="button">Revoke</button>
                <button type="button">Rotate</button>
              </div>
            </article>
          </div>

          <div className="workflow-box">
            <h4>User Approval Workflow</h4>
            <p>Business email registration to admin review to approve/reject with reason to notification to API access.</p>
          </div>

          <div className="workflow-box">
            <h4>Request History (Drill-down)</h4>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Endpoint</th>
                    <th>Request Count</th>
                  </tr>
                </thead>
                <tbody>
                  {requestHistory.map((entry) => (
                    <tr key={`${entry.day}-${entry.endpoint}`}>
                      <td>{entry.day}</td>
                      <td>{entry.endpoint}</td>
                      <td>{entry.count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="notes-box">
            <h4>Admin Notes / Comments</h4>
            <textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add review notes for this business account..."
            />
            <button type="button" onClick={saveNote}>
              Save Note
            </button>
            {selectedUser.notes?.length > 0 && (
              <div className="notes-list">
                {selectedUser.notes.map((item) => (
                  <p key={`${item.at}-${item.note}`}>
                    {item.by}: {item.note}
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </AppShell>
  );
}
