import { useState } from "react";
import AppShell from "../components/layout/AppShell";
import { registerB2BUser } from "../services/api";

const defaultValues = {
  businessEmail: "",
  businessName: "",
  gstNumber: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

export default function B2BRegisterPage() {
  const [form, setForm] = useState(defaultValues);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const passwordMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  const update = (field) => (event) => setForm((value) => ({ ...value, [field]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    registerB2BUser(form)
      .then((result) => {
        setSubmitted(true);
        setMessage(`${result.message} User ID: ${result.user.id}`);
      })
      .catch(() => {
        setSubmitted(false);
        setMessage("Registration request failed.");
      });
  };

  return (
    <AppShell portal="b2b" title="B2B Self-Registration Process">
      <section className="panel narrow">
        <h3>Registration Form Fields</h3>
        <form className="form-grid" onSubmit={submit}>
          <label>
            Business Email (no free email providers)
            <input type="email" required value={form.businessEmail} onChange={update("businessEmail")} placeholder="name@company.com" />
          </label>
          <label>
            Business Name (registered company name)
            <input type="text" required value={form.businessName} onChange={update("businessName")} />
          </label>
          <label>
            GST Number (optional)
            <input type="text" value={form.gstNumber} onChange={update("gstNumber")} />
          </label>
          <label>
            Phone Number (with country code)
            <input type="tel" required value={form.phoneNumber} onChange={update("phoneNumber")} placeholder="+91 98xxxxxx12" />
          </label>
          <label>
            Password (minimum 8 chars with complexity)
            <input type="password" required minLength={8} value={form.password} onChange={update("password")} />
          </label>
          <label>
            Confirm Password
            <input type="password" required minLength={8} value={form.confirmPassword} onChange={update("confirmPassword")} />
          </label>
          {passwordMismatch && <p className="error-text">Passwords do not match.</p>}
          <button type="submit" disabled={passwordMismatch}>
            Submit Registration
          </button>
        </form>
      </section>

      <section className="panel">
        <h3>Post-Registration Flow</h3>
        <ol className="flow-list">
          <li>Account status set to PENDING_APPROVAL</li>
          <li>Confirmation email sent to the user</li>
          <li>Admin receives review notification</li>
          <li>User cannot generate API keys until approved</li>
        </ol>
        {submitted && <p className="success-text">{message || "Registration submitted. Status is PENDING_APPROVAL."}</p>}
        {!submitted && message && <p className="error-text">{message}</p>}
      </section>
    </AppShell>
  );
}
