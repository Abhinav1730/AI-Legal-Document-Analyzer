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
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
        isDragActive
          ? "border-yellow-400 bg-[#1E3A5F] shadow-lg"
          : "border-gray-500 bg-[#0B1B2B] hover:border-yellow-400 hover:shadow-md"
      }`}
    >
      <input {...getInputProps()} />
      <FileUp
        size={48}
        className={`mb-4 ${
          isDragActive ? "text-yellow-400 animate-bounce" : "text-gray-400"
        }`}
      />
      {isDragActive ? (
        <p className="text-yellow-400 text-lg font-semibold">
          Drop the files here...
        </p>
      ) : (
        <p className="text-gray-300 text-base sm:text-lg">
          Drag & drop <span className="text-white font-medium">legal docs</span>{" "}
          here, or <span className="text-yellow-400 font-semibold">click</span>{" "}
          to upload <br /> (PDF, DOCX, Images)
        </p>
      )}
    </div>
  );
}
