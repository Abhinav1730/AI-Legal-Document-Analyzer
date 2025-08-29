const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function request(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: "include",
    ...options,
  });
  if (!res.ok) throw new Error("API Error");
  return res.json();
}

export const api = {
  me: () => request("/api/auth/me"),
  logout: () => request("/api/auth/logout"),
  getDocs: () => request("/api/docs"),

  uploadDoc: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${BASE_URL}/api/docs/upload`, {
      method: "POST",
      body: fd,
      credentials: "include",
    }).then((res) => res.json());
  },

  analyzeDoc: (id) => request(`/api/docs/${id}/analyze`, { method: "POST" }),
  deleteDoc: (id) => request(`/api/docs/${id}`, { method: "DELETE" }),
};
