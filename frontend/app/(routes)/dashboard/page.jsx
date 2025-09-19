"use client";
import { useAuth } from "../../../context/AuthContext";
import FileDropzone from "../../../components/FileDropZone";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api.js";
import HighlightModal from "../../../components/HighlightModal";
import { FileText, Trash2, RefreshCcw, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(false);
  const [analyzingDoc, setAnalyzingDoc] = useState(null);

  useEffect(() => {
    if (user) fetchDocs();
  }, [user]);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      console.log('Fetching documents...');
      const res = await api.getDocs();
      console.log('Documents fetched:', res);
      setDocs(res || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocs([]);
    } finally {
      setLoading(false);
    }
  };


  const viewDocument = async (doc) => {
    setViewingDoc(true);
    try {
      console.log('Fetching full document:', doc._id);
      const fullDoc = await api.getDoc(doc._id);
      console.log('Full document fetched:', fullDoc);
      setSelectedDoc(fullDoc);
    } catch (error) {
      console.error('Error fetching document:', error);
      alert('Error loading document: ' + error.message);
    } finally {
      setViewingDoc(false);
    }
  };

  const analyzeDocument = async (doc) => {
    setAnalyzingDoc(doc._id);
    try {
      console.log('Analyzing document:', doc._id);
      const result = await api.analyzeDoc(doc._id);
      console.log('Analysis result:', result);
      
      // Show success message
      if (result.message) {
        alert(result.message);
      }
      
      // Refresh documents to show updated analysis
      await fetchDocs();
    } catch (error) {
      console.error('Error analyzing document:', error);
      alert('Analysis failed: ' + error.message);
    } finally {
      setAnalyzingDoc(null);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-300">
        <h2 className="text-2xl font-bold">🔒 {t("dashboard.login_required")}</h2>
        <p className="text-gray-400 mt-2">{t("dashboard.login_required_desc")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-12 space-y-10 bg-black">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-white tracking-wide">
        📂 {t("dashboard.title")}
      </h1>

      {/* Upload Dropzone */}
      <FileDropzone onUpload={fetchDocs} />

      {/* Analysis Summary */}
      {docs.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">📊 {t("dashboard.analysis_summary")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{docs.length}</div>
              <div className="text-sm text-gray-400">{t("dashboard.total_documents")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {docs.filter(doc => doc.annotations && doc.annotations.length > 0).length}
              </div>
              <div className="text-sm text-gray-400">{t("dashboard.analyzed")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {docs.filter(doc => !doc.annotations || doc.annotations.length === 0).length}
              </div>
              <div className="text-sm text-gray-400">{t("dashboard.pending_analysis")}</div>
            </div>
          </div>
        </div>
      )}


      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-lg">{t("dashboard.loading_documents")}</p>
        </div>
      ) : docs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {docs.map((doc) => (
            <div
              key={doc._id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 elevate transition-all duration-300 flex flex-col justify-between border border-white/10 hover:border-white/30"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="text-white" size={24} />
                <h3 className="text-lg font-semibold text-white truncate">
                  {doc.originalName}
                </h3>
              </div>

              {/* Date and Analysis Status */}
              <div className="mb-6 space-y-2">
                <p className="text-gray-400 text-sm">
                  {t("dashboard.uploaded")}: {new Date(doc.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${doc.annotations && doc.annotations.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs text-gray-400">
                    {doc.annotations && doc.annotations.length > 0 
                      ? `${doc.annotations.length} ${t("dashboard.clauses_found")}` 
                      : t("dashboard.analysis_pending")
                    }
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-auto">
                <button
                  onClick={() => viewDocument(doc)}
                  disabled={viewingDoc}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye size={18} /> <span>{viewingDoc ? t("dashboard.loading") : t("dashboard.view")}</span>
                </button>
                <button
                  onClick={() => analyzeDocument(doc)}
                  disabled={analyzingDoc === doc._id}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-500 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCcw size={18} className={analyzingDoc === doc._id ? 'animate-spin' : ''} /> 
                  <span>{analyzingDoc === doc._id ? t("dashboard.analyzing") : t("dashboard.analyze")}</span>
                </button>
                <button
                  onClick={() => api.deleteDoc(doc._id).then(fetchDocs)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-500 hover:to-red-700 transition"
                >
                  <Trash2 size={18} /> <span>{t("dashboard.delete")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-12">
          <p className="text-lg">{t("dashboard.no_documents")}</p>
          <p className="text-sm">{t("dashboard.no_documents_desc")}</p>
        </div>
      )}

      {/* Highlight Modal */}
      {selectedDoc && (
        <HighlightModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </div>
  );
}
