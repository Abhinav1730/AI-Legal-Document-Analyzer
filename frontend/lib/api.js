const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default async function request(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
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
  logout: () => request("/api/auth/logout", { method: "POST" }),

  // 🔹 Documents
  getDocs: () => request("/api/docs"),

  uploadDoc: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${BASE_URL}/api/docs/upload`, {
      method: "POST",
      body: fd,
      credentials: "include", // important!
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
