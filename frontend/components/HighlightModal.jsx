"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function HighlightModal({ doc, onClose }) {
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
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">
              {doc.filename}
            </h2>

            {/* Annotations */}
            <div className="max-h-[420px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {doc.annotations && doc.annotations.length > 0 ? (
                doc.annotations.map((a, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 transition"
                  >
                    <span className="font-semibold text-white">
                      Clause:
                    </span>{" "}
                    {a.text || a.summary_text}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">No highlights available.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
