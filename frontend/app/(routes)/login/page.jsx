"use client";

import React, { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0B1B2B] to-[#12263A] px-6">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#FFD700] mb-4 drop-shadow-md">
          Redirecting...
        </h2>
        <p className="text-gray-300 text-base md:text-lg mb-8">
          Connecting to Google for secure login
        </p>

        {/* Spinner */}
        <div className="flex justify-center items-center space-x-2">
          <div className="w-4 h-4 bg-[#FFD700] rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-[#FFD700] rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-[#FFD700] rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default Page;

