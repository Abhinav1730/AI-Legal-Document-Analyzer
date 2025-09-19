"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export default function HighlightModal({ doc, onClose }) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl elevate w-full max-w-2xl p-6 relative border border-white/10"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white hover:scale-110 transition-transform"
            >
              <X size={22} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">{doc.originalName}</h2>

            {/* Analysis Status */}
            <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${doc.annotations && doc.annotations.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm font-medium text-white">
                    {doc.annotations && doc.annotations.length > 0 ? t("document_modal.analysis_complete") : t("document_modal.analysis_pending")}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {doc.annotations ? `${doc.annotations.length} ${t("document_modal.clauses_found")}` : t("document_modal.no_analysis")}
                </span>
              </div>
            </div>

            {/* Document Content */}
            <div className="max-h-[420px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {doc.annotations && doc.annotations.length > 0 ? (
                // Show analysis results
                <div className="space-y-3">
                  <div className="text-sm text-gray-300 mb-3">
                    {t("document_modal.found_clauses", { count: doc.annotations.length })}
                  </div>
                  {doc.annotations.map((a, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-blue-300 capitalize">
                          {a.type || t("document_modal.unknown_clause")}
                        </div>
                        {a.confidence && (
                          <div className="text-xs text-gray-400">
                            {t("document_modal.confidence")}: {Math.round(a.confidence * 100)}%
                          </div>
                        )}
                      </div>
                      {a.subcategory && (
                        <div className="text-xs text-yellow-300 mb-2 font-medium">
                          📋 {a.subcategory}
                        </div>
                      )}
                      <div className="text-sm leading-relaxed">
                        {a.snippet || a.text || a.summary_text}
                      </div>
                    </div>
                  ))}
                </div>
              ) : doc.text ? (
                // Show document text if no analysis
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200">
                    <div className="text-sm mb-2 text-yellow-300 font-medium">
                      📄 {t("document_modal.document_text")}
                    </div>
                    <div className="text-sm leading-relaxed">
                      {doc.text.length > 1000 ? doc.text.substring(0, 1000) + '...' : doc.text}
                    </div>
                  </div>
                  {doc.text.length > 1000 && (
                    <div className="text-xs text-gray-400 text-center">
                      {t("document_modal.showing_preview")}
                    </div>
                  )}
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200">
                    <div className="text-sm font-medium mb-1">🤖 {t("document_modal.ai_analysis_available")}</div>
                    <div className="text-xs">
                      {t("document_modal.ai_analysis_desc")}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic">{t("document_modal.no_content")}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
