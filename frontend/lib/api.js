const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

let token = null;
export const authToken = {
  set: (t) => { token = t; },
  get: () => token,
  clear: () => { token = null; }
};

export default async function request(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API Error");
  }

  return res.json();
}

export const api = {
  // 🔹 Auth
  me: () => request("/api/auth/me"),
  logout: async () => {
    try { await request("/api/auth/logout", { method: "POST" }); } catch(e) {}
    authToken.clear();
  },
  register: ({ name, email, password }) => request("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: async ({ email, password }) => {
    const res = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    if(res.token) authToken.set(res.token);
    return res;
  },

  // 🔹 Documents
  getDocs: () => request("/api/docs"),

  uploadDoc: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${BASE_URL}/api/docs/upload`, {
      method: "POST",
      body: fd,
      credentials: "include", // important!
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    }).then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Upload failed");
      }
      return res.json();
    });
  },

  analyzeDoc: (id) =>
    request(`/api/docs/${id}/analyze`, { method: "POST" }),

  deleteDoc: (id) =>
    request(`/api/docs/${id}`, { method: "DELETE" }),
};
