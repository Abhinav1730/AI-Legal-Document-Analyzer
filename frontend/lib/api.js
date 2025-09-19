const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

let token = null;
export const authToken = {
  set: (t) => { token = t; },
  get: () => token,
  clear: () => { token = null; }
};

function withLang(url) {
  try {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    const lang = saved || "en";
    const hasQuery = url.includes("?");
    const sep = hasQuery ? "&" : "?";
    // avoid duplicate lang
    if (url.includes("lang=")) return url;
    return `${url}${sep}lang=${encodeURIComponent(lang)}`;
  } catch {
    return url;
  }
}

export default async function request(url, options = {}) {
  const fullUrl = `${BASE_URL}${withLang(url)}`;
  console.log('Making request to:', fullUrl, 'with options:', options);
  
  try {
    const res = await fetch(fullUrl, {
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

    console.log('Response status:', res.status, 'ok:', res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', res.status, errorText);
      throw new Error(errorText || `API Error: ${res.status}`);
    }

    const result = await res.json();
    console.log('Request successful:', result);
    return result;
  } catch (error) {
    console.error('Request failed:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
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
  getDocs: async () => {
    console.log('API getDocs called, token:', token ? 'present' : 'missing');
    try {
      const result = await request("/api/docs");
      console.log('getDocs result:', result);
      return result;
    } catch (error) {
      console.error('getDocs error:', error);
      throw error;
    }
  },


  uploadDoc: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    console.log('API uploadDoc called with file:', file.name, 'token:', token ? 'present' : 'missing');
    return fetch(`${BASE_URL}${withLang(`/api/docs/upload`)}`, {
      method: "POST",
      body: fd,
      credentials: "include", // important!
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    }).then(async (res) => {
      console.log('Upload response status:', res.status);
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Upload error response:', errorText);
        throw new Error(errorText || "Upload failed");
      }
      const result = await res.json();
      console.log('Upload success:', result);
      return result;
    });
  },

  getDoc: (id) =>
    request(withLang(`/api/docs/${id}`)),

  analyzeDoc: async (id) => {
    console.log('API analyzeDoc called with id:', id);
    try {
      const result = await request(withLang(`/api/docs/${id}/analyze`), { method: "POST" });
      console.log('analyzeDoc result:', result);
      return result;
    } catch (error) {
      console.error('analyzeDoc error:', error);
      throw error;
    }
  },

  deleteDoc: (id) =>
    request(withLang(`/api/docs/${id}`), { method: "DELETE" }),
};
