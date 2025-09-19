"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Menu, X, Sun, Moon, ChevronDown, FileText, Eye } from "lucide-react";
import { api } from "../lib/api";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "or", label: "ଓଡ଼ିଆ" }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    try { localStorage.setItem("lang", code); } catch {}
    setLangOpen(false);
  }

  // Fetch documents for dropdown
  const fetchDocuments = async () => {
    if (!user) return;
    
    setLoadingDocs(true);
    try {
      const docs = await api.getDocs();
      setDocuments(docs || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  // Fetch documents when user logs in
  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setDocuments([]);
    }
  }, [user]);

  // View document function
  const viewDocument = async (doc) => {
    try {
      const fullDoc = await api.getDoc(doc._id);
      // Open in new tab or handle as needed
      window.open(`/dashboard?view=${doc._id}`, '_blank');
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const basePanel = theme === "dark"
    ? "bg-black/90 text-white border border-white/10"
    : "bg-white text-black border border-neutral-200";
  const baseBtn = theme === "dark"
    ? "bg-white/5 text-white border border-white/10 hover:border-white"
    : "bg-white text-black border border-neutral-300 hover:border-black/40";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="/"
          className="text-2xl font-extrabold text-white flex items-center space-x-2 hover:opacity-90 transition"
        >
          ⚖️ <span>LegalAI</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Documents dropdown */}
          {user && (
            <div className="relative">
              <button
                aria-label="Documents"
                onClick={() => {
                  setDocsOpen((v) => !v);
                  if (!docsOpen) fetchDocuments();
                }}
                className={`px-3 py-2 rounded-lg transition flex items-center gap-2 ${baseBtn}`}
              >
                <FileText size={16} />
                <span>{t("navbar.documents")} ({documents.length})</span>
                <ChevronDown size={16} />
              </button>
              {docsOpen && (
                <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-xl ${basePanel} max-h-96 overflow-hidden`}
                     onMouseLeave={() => setDocsOpen(false)}>
                  <div className="p-3 border-b border-white/10">
                    <h3 className="font-semibold text-sm text-gray-300">{t("navbar.your_documents")}</h3>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {loadingDocs ? (
                      <div className="p-4 text-center text-gray-400">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                        {t("dashboard.loading_documents")}
                      </div>
                    ) : documents.length > 0 ? (
                      <ul className="py-1">
                        {documents.map((doc) => (
                          <li key={doc._id}>
                            <button
                              className="w-full text-left px-3 py-3 hover:bg-white/5 transition flex items-center justify-between group"
                              onClick={() => {
                                viewDocument(doc);
                                setDocsOpen(false);
                              }}
                            >
                              <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <FileText size={16} className="text-blue-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-white truncate">
                                    {doc.originalName}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {doc.annotations && doc.annotations.length > 0 
                                      ? `${doc.annotations.length} {t("dashboard.clauses_found")}` 
                                      : '{t("dashboard.analysis_pending")}'
                                    }
                                  </div>
                                </div>
                              </div>
                              <Eye size={14} className="text-gray-400 group-hover:text-white transition flex-shrink-0" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        <FileText size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t("navbar.no_documents_yet")}</p>
                        <p className="text-xs">{t("navbar.upload_first")}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Language custom dropdown */}
          <div className="relative">
            <button
              aria-label="Language"
              onClick={() => setLangOpen((v) => !v)}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-2 ${baseBtn}`}
            >
              <span>{LANGS.find(l => l.code === i18n.language)?.label || "English"}</span>
              <ChevronDown size={16} />
            </button>
            {langOpen && (
              <div className={`absolute right-0 mt-2 w-44 rounded-lg shadow-xl ${basePanel}`}
                   onMouseLeave={() => setLangOpen(false)}>
                <ul className="py-1 max-h-72 overflow-auto">
                  {LANGS.map(l => (
                    <li key={l.code}>
                      <button
                        className={`w-full text-left px-3 py-2 hover:opacity-90 ${i18n.language===l.code? (theme==="dark"?"bg-white/10":"bg-black/5") : ""}`}
                        onClick={() => changeLang(l.code)}
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className={`px-3 py-2 rounded-lg ${baseBtn}`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <>
              <a
                href="/dashboard"
                className="text-gray-300 hover:text-white transition"
              >
                Dashboard
              </a>
              <span className="px-3 py-1 rounded-full text-sm bg-white/5 text-gray-300 border border-white/10">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-700 text-white font-semibold hover:from-neutral-700 hover:to-neutral-600 transition shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login?mode=register"
                className="px-5 py-2 rounded-lg bg-white text-black font-bold shadow-md hover:bg-neutral-200 transition glow"
              >
                {t("get_started", { defaultValue: "Get Started" })}
              </a>
              <a
                href="/login"
                className="px-5 py-2 rounded-lg bg-white/5 text-white border border-white/10 font-semibold hover:border-white transition"
              >
                {t("login", { defaultValue: "Login" })}
              </a>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className={`px-3 py-2 rounded-lg ${baseBtn}`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-200 hover:text-white focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black/70 backdrop-blur-xl px-6 py-4 space-y-4 border-t border-white/10">
          {/* Mobile documents dropdown */}
          {user && (
            <div className="relative">
              <button
                aria-label="Documents"
                onClick={() => {
                  setDocsOpen((v) => !v);
                  if (!docsOpen) fetchDocuments();
                }}
                className={`w-full justify-between px-3 py-2 rounded-lg transition flex items-center gap-2 ${baseBtn}`}
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>Documents ({documents.length})</span>
                </div>
                <ChevronDown size={16} />
              </button>
              {docsOpen && (
                <div className={`mt-2 w-full rounded-lg shadow-xl ${basePanel} max-h-64 overflow-hidden`}>
                  <div className="p-3 border-b border-white/10">
                    <h3 className="font-semibold text-sm text-gray-300">Your Documents</h3>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {loadingDocs ? (
                      <div className="p-4 text-center text-gray-400">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                        Loading documents...
                      </div>
                    ) : documents.length > 0 ? (
                      <ul className="py-1">
                        {documents.map((doc) => (
                          <li key={doc._id}>
                            <button
                              className="w-full text-left px-3 py-3 hover:bg-white/5 transition flex items-center justify-between group"
                              onClick={() => {
                                viewDocument(doc);
                                setDocsOpen(false);
                                setIsOpen(false);
                              }}
                            >
                              <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <FileText size={16} className="text-blue-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-white truncate">
                                    {doc.originalName}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {doc.annotations && doc.annotations.length > 0 
                                      ? `${doc.annotations.length} {t("dashboard.clauses_found")}` 
                                      : '{t("dashboard.analysis_pending")}'
                                    }
                                  </div>
                                </div>
                              </div>
                              <Eye size={14} className="text-gray-400 group-hover:text-white transition flex-shrink-0" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        <FileText size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t("navbar.no_documents_yet")}</p>
                        <p className="text-xs">{t("navbar.upload_first")}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile language dropdown */}
          <div className="relative">
            <button
              aria-label="Language"
              onClick={() => setLangOpen((v) => !v)}
              className={`w-full justify-between px-3 py-2 rounded-lg transition flex items-center gap-2 ${baseBtn}`}
            >
              <span>{LANGS.find(l => l.code === i18n.language)?.label || "English"}</span>
              <ChevronDown size={16} />
            </button>
            {langOpen && (
              <div className={`absolute left-0 mt-2 w-full rounded-lg shadow-xl ${basePanel}`}>
                <ul className="py-1 max-h-72 overflow-auto">
                  {LANGS.map(l => (
                    <li key={l.code}>
                      <button
                        className={`w-full text-left px-3 py-2 hover:opacity-90 ${i18n.language===l.code? (theme==="dark"?"bg-white/10":"bg-black/5") : ""}`}
                        onClick={() => changeLang(l.code)}
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {user ? (
            <>
              <a
                href="/dashboard"
                className="block text-gray-300 hover:text-white transition"
              >
                Dashboard
              </a>
              <span className="block text-gray-400">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-700 text-white font-semibold hover:from-neutral-700 hover:to-neutral-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login?mode=register"
                className="block w-full text-center px-4 py-2 rounded-lg bg-white text-black font-bold shadow-md hover:bg-neutral-200 transition glow"
              >
                {t("get_started", { defaultValue: "Get Started" })}
              </a>
              <a
                href="/login"
                className="block w-full text-center px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10 font-semibold hover:border-white transition mt-2"
              >
                {t("login", { defaultValue: "Login" })}
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
