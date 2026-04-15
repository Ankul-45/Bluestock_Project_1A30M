import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { applyStateAccessPolicy, getStateAccessAuditLog } from "../services/api";

const regionMap = {
  North: ["Delhi", "UP", "Punjab", "Haryana", "Uttarakhand"],
  South: ["Karnataka", "Tamil Nadu", "Kerala", "Andhra Pradesh", "Telangana"],
  East: ["West Bengal", "Odisha", "Bihar", "Jharkhand", "Assam"],
  West: ["Maharashtra", "Gujarat", "Goa", "Rajasthan", "MP"],
};

export default function StateAccessPage() {
  const [mode, setMode] = useState("all");
  const [region, setRegion] = useState("South");
  const [customStates, setCustomStates] = useState("Maharashtra,Karnataka,Tamil Nadu");
  const [targetUserId, setTargetUserId] = useState("U-1001");
  const [auditLog, setAuditLog] = useState([]);
  const [message, setMessage] = useState("");

  const fetchAudit = () => {
    getStateAccessAuditLog()
      .then(setAuditLog)
      .catch(() => setMessage("Could not load audit log."));
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  const previewStates =
    mode === "all"
      ? ["All India Access"]
      : mode === "region"
        ? regionMap[region]
        : customStates
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);

  const applyPolicy = () => {
    applyStateAccessPolicy(targetUserId, {
      mode,
      region,
      states: previewStates,
    })
      .then(() => {
        setMessage("State access policy applied.");
        fetchAudit();
      })
      .catch(() => setMessage("Could not apply state access policy."));
  };

  return (
    <AppShell portal="admin" title="State Access Management">
      <section className="panel">
        <h3>Grant / Revoke State-level Access</h3>
        <div className="controls-grid">
          <input
            type="text"
            value={targetUserId}
            onChange={(event) => setTargetUserId(event.target.value)}
            placeholder="Target user id (example: U-1001)"
          />
        </div>

        <div className="mode-switch">
          <label>
            <input type="radio" name="mode" checked={mode === "all"} onChange={() => setMode("all")} />
            Grant all states (full India access)
          </label>
          <label>
            <input type="radio" name="mode" checked={mode === "specific"} onChange={() => setMode("specific")} />
            Select specific states
          </label>
          <label>
            <input type="radio" name="mode" checked={mode === "region"} onChange={() => setMode("region")} />
            Grant by region
          </label>
        </div>

        {mode === "specific" && (
          <textarea
            rows={2}
            value={customStates}
            onChange={(event) => setCustomStates(event.target.value)}
            placeholder="Comma separated states"
          />
        )}

        {mode === "region" && (
          <select value={region} onChange={(event) => setRegion(event.target.value)}>
            {Object.keys(regionMap).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        )}

        <div className="state-preview">
          <h4>Access Preview</h4>
          <p>{previewStates.join(", ")}</p>
        </div>

        <div className="inline-buttons">
          <button type="button" onClick={applyPolicy}>
            Apply Access Policy
          </button>
          <button type="button" className="danger" onClick={() => setMessage("Use mode=all/region/specific and re-apply to revoke/grant.") }>
            Revoke Access
          </button>
        </div>

        {message && <p className="panel-copy">{message}</p>}
      </section>

      <section className="panel">
        <h3>Audit Log of Access Changes</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Target User</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((entry) => (
                <tr key={`${entry.date}-${entry.target}-${entry.action}`}>
                  <td>{entry.date}</td>
                  <td>{entry.admin}</td>
                  <td>{entry.action}</td>
                  <td>{entry.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
