"use client";
import React from "react";

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 sm:px-12 bg-gradient-to-b from-[#0B1B2B] to-[#12263A]">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/white-paper.png')]"></div>

      {/* Main*/}
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#FFD700] drop-shadow-md mb-6 tracking-wide">
          LEGALYZER
        </h1>
        <h3 className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
          Upload <span className="text-white font-semibold">contracts, agreements, or policies</span> 
          and let our AI highlight key clauses like{" "}
          <span className="text-white font-semibold">termination, payments,</span> and{" "}
          <span className="text-white font-semibold">risks</span>.  
          Secure, smart, and simple.
        </h3>
        <a
          href="/login"
          className="inline-block px-8 py-4 rounded-2xl bg-[#FFD700] text-[#0B1B2B] text-lg font-bold shadow-xl hover:bg-yellow-400 hover:scale-105 transition-transform duration-300"
        >
          Get Started
        </a>
      </div>

      {/* Footer*/}
      <div className="absolute bottom-6 text-sm text-gray-400">
        © {new Date().getFullYear()} Legal Analyzer by Abhinav Saxena. All Rights Reserved.
      </div>
    </div>
  );
};

export default HomePage;

