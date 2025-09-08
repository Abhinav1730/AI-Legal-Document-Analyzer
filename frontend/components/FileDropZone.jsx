"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../lib/api";
import { FileUp } from "lucide-react"; // nice file upload icon

export default function FileDropzone({ onUpload }) {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      for (const file of acceptedFiles) {
        await api.uploadDoc(file);
      }
      onUpload();
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
        isDragActive
          ? "border-white bg-white/5 backdrop-blur-xl elevate"
          : "border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/30 elevate"
      }`}
    >
      <input {...getInputProps()} />
      <FileUp
        size={48}
        className={`mb-4 ${
          isDragActive ? "text-white animate-bounce" : "text-gray-400"
        }`}
      />
      {isDragActive ? (
        <p className="text-white text-lg font-semibold">
          Drop the files here...
        </p>
      ) : (
        <p className="text-gray-300 text-base sm:text-lg">
          Drag & drop <span className="text-white font-medium">legal docs</span>{" "}
          here, or <span className="text-white font-semibold">click</span>{" "}
          to upload <br /> (PDF, DOCX, Images)
        </p>
      )}
    </div>
  );
}
