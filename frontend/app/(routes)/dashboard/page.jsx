"use client";
import { useAuth } from "../../../context/AuthContext";
import FileDropzone from "../../../components/FileDropZone";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api.js";
import HighlightModal from "../../../components/HighlightModal";
import { FileText, Trash2, RefreshCcw, Eye } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    if (user) fetchDocs();
  }, [user]);

  const fetchDocs = async () => {
    const res = await api.getDocs();
    setDocs(res || []);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-300">
        <h2 className="text-2xl font-bold">🔒 Please log in first.</h2>
        <p className="text-gray-400 mt-2">Access your secure documents after login.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-12 space-y-10 bg-black">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-white tracking-wide">
        📂 Your Legal Documents
      </h1>

      {/* Upload Dropzone */}
      <FileDropzone onUpload={fetchDocs} />

      {/* Documents Grid */}
      {docs.length > 0 ? (
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
                  {doc.filename}
                </h3>
              </div>

              {/* Date */}
              <p className="text-gray-400 text-sm mb-6">
                Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-auto">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition"
                >
                  <Eye size={18} /> <span>View</span>
                </button>
                <button
                  onClick={() => api.analyzeDoc(doc._id).then(fetchDocs)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-700 text-white font-medium hover:from-neutral-700 hover:to-neutral-600 transition"
                >
                  <RefreshCcw size={18} /> <span>Reanalyze</span>
                </button>
                <button
                  onClick={() => api.deleteDoc(doc._id).then(fetchDocs)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-500 hover:to-red-700 transition"
                >
                  <Trash2 size={18} /> <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-12">
          <p className="text-lg">No documents uploaded yet.</p>
          <p className="text-sm">Upload contracts, agreements, or policies to get started.</p>
        </div>
      )}

      {/* Highlight Modal */}
      {selectedDoc && (
        <HighlightModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </div>
  );
}
