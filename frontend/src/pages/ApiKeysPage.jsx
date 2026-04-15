import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { getApiKeys, mutateApiKey } from "../services/api";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedKeyId, setSelectedKeyId] = useState("");

  const loadKeys = () => {
    getApiKeys()
      .then((result) => {
        setKeys(result);
        if (!selectedKeyId && result.length) {
          setSelectedKeyId(result[0].id);
        }
      })
      .catch(() => setMessage("Could not fetch API keys."));
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const doAction = (action) => {
    mutateApiKey(action, selectedKeyId)
      .then((result) => {
        setKeys(result.keys || []);
        setMessage(`API key ${action} action completed.`);
      })
      .catch(() => setMessage(`API key ${action} failed.`));
  };

  return (
    <AppShell portal="b2b" title="API Keys Management">
      <section className="panel">
        <h3>Create, Revoke, Rotate API Keys</h3>
        <div className="controls-grid">
          <select value={selectedKeyId} onChange={(event) => setSelectedKeyId(event.target.value)}>
            <option value="">Select key</option>
            {keys.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}
              </option>
            ))}
          </select>
        </div>
        <div className="inline-buttons">
          <button
            type="button"
            onClick={() =>
              mutateApiKey("create")
                .then((result) => {
                  setKeys(result.keys || []);
                  if (result.keys?.length) setSelectedKeyId(result.keys[0].id);
                  setMessage("API key create action completed.");
                })
                .catch(() => setMessage("API key create failed."))
            }
          >
            Generate New Key
          </button>
          <button type="button" onClick={() => doAction("rotate")} disabled={!selectedKeyId}>
            Rotate Active Key
          </button>
          <button type="button" className="danger" onClick={() => doAction("revoke")} disabled={!selectedKeyId}>
            Revoke Selected
          </button>
        </div>
        {message && <p className="panel-copy">{message}</p>}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Key ID</th>
                <th>Masked Key</th>
                <th>Created At</th>
                <th>Last Used</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.key}</td>
                  <td>{item.createdAt}</td>
                  <td>{item.lastUsedAt}</td>
                  <td>
                    <span className={`status ${item.status === "Revoked" ? "suspended" : "active"}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
