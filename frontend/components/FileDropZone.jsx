"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../lib/api";
import { FileUp, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FileDropzone({ onUpload }) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setUploading(true);
      setUploadStatus(null);
      
      try {
        for (const file of acceptedFiles) {
          console.log('Uploading file:', file.name, file.type, file.size);
          const result = await api.uploadDoc(file);
          console.log('Upload result:', result);
        }
        setUploadStatus('success');
        onUpload();
        
        // Clear success message after 3 seconds
        setTimeout(() => setUploadStatus(null), 3000);
      } catch (error) {
        console.error('Upload error:', error);
        setUploadStatus('error');
        alert('Upload failed: ' + error.message);
        
        // Clear error message after 5 seconds
        setTimeout(() => setUploadStatus(null), 5000);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    disabled: uploading 
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-10 sm:p-16 text-center transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
        uploading
          ? "border-blue-400 bg-blue-500/10 backdrop-blur-xl cursor-not-allowed"
          : isDragActive
          ? "border-white bg-white/5 backdrop-blur-xl cursor-pointer"
          : "border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/30 cursor-pointer"
      }`}
    >
      <input {...getInputProps()} />
      
      {/* Icon based on state */}
      {uploading ? (
        <Loader2 size={48} className="mb-4 text-blue-400 animate-spin" />
      ) : uploadStatus === 'success' ? (
        <CheckCircle size={48} className="mb-4 text-green-400" />
      ) : uploadStatus === 'error' ? (
        <XCircle size={48} className="mb-4 text-red-400" />
      ) : (
        <FileUp
          size={48}
          className={`mb-4 ${
            isDragActive ? "text-white animate-bounce" : "text-gray-400"
          }`}
        />
      )}

      {/* Text based on state */}
      {uploading ? (
        <p className="text-blue-400 text-lg font-semibold">
          {t("file_upload.uploading")}
        </p>
      ) : uploadStatus === 'success' ? (
        <p className="text-green-400 text-lg font-semibold">
          {t("file_upload.success")}
        </p>
      ) : uploadStatus === 'error' ? (
        <p className="text-red-400 text-lg font-semibold">
          {t("file_upload.error")}
        </p>
      ) : isDragActive ? (
        <p className="text-white text-lg font-semibold">
          {t("file_upload.drop_files")}
        </p>
      ) : (
        <p className="text-gray-300 text-base sm:text-lg">
          {t("file_upload.drag_drop")} <br /> {t("file_upload.file_types")}
        </p>
      )}
    </div>
  );
}
