const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_KEY = import.meta.env.VITE_API_KEY || "test123";
const API_SECRET = import.meta.env.VITE_API_SECRET || "secret123";
export const B2B_USER_ID = import.meta.env.VITE_B2B_USER_ID || "U-1002";

const defaultHeaders = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
  "x-api-secret": API_SECRET,
};

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function toQueryString(query = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const asString = params.toString();
  return asString ? `?${asString}` : "";
}

export function getStates() {
  return request("/states");
}

export function getDistrictsByState(stateId) {
  return request(`/states/${stateId}/districts`);
}

export function getSubDistrictsByDistrict(districtId) {
  return request(`/districts/${districtId}/subdistricts`);
}

export function getVillagesBySubDistrict(subDistrictId, page, limit) {
  return request(`/subdistricts/${subDistrictId}/villages?page=${page}&limit=${limit}`);
}

export function getAdminAnalytics() {
  return request("/admin/analytics");
}

export function getAdminUsers(query) {
  return request(`/admin/users${toQueryString(query)}`);
}

export function updateAdminUserStatus(userId, status) {
  return request(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function addAdminUserNote(userId, note) {
  return request(`/admin/users/${userId}/notes`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

export function applyStateAccessPolicy(userId, payload) {
  return request(`/admin/users/${userId}/state-access`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getStateAccessAuditLog() {
  return request("/admin/state-access/audit");
}

export function browseVillages(query) {
  return request(`/admin/villages${toQueryString(query)}`);
}

export function registerB2BUser(payload) {
  return request("/b2b/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getB2BDashboard(userId = B2B_USER_ID) {
  return request(`/b2b/dashboard/${userId}`);
}

export function getApiKeys(userId = B2B_USER_ID) {
  return request(`/b2b/keys/${userId}`);
}

export function mutateApiKey(action, keyId, userId = B2B_USER_ID) {
  return request(`/b2b/keys/${userId}`, {
    method: "POST",
    body: JSON.stringify({ action, keyId }),
  });
}
