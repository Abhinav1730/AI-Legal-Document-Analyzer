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
    <div className="min-h-screen py-12 px-6 md:px-12 space-y-10 bg-[#0B1B2B]">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-[#FFD700] tracking-wide">
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
              className="bg-[#142B47] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-gray-700 hover:border-[#FFD700]"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="text-[#FFD700]" size={24} />
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
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#FFD700] text-[#0B1B2B] font-medium hover:bg-yellow-400 transition"
                >
                  <Eye size={18} /> <span>View</span>
                </button>
                <button
                  onClick={() => api.analyzeDoc(doc._id).then(fetchDocs)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  <RefreshCcw size={18} /> <span>Reanalyze</span>
                </button>
                <button
                  onClick={() => api.deleteDoc(doc._id).then(fetchDocs)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
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
