"use client";
import React from "react";

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 sm:px-12 bg-[var(--background)]">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/white-paper.png')]"></div>

      {/* Hero */}
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[var(--foreground)] drop-shadow-md mb-6 tracking-wide">
          LEGALYZER
        </h1>
        <h3 className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
          Upload <span className="text-[var(--foreground)] font-semibold">contracts, agreements, or policies</span>
          and let our AI highlight key clauses like {""}
          <span className="text-[var(--foreground)] font-semibold">termination, payments,</span> and {""}
          <span className="text-[var(--foreground)] font-semibold">risks</span>. Secure, smart, and simple.
        </h3>

        {/* Key capabilities */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-[var(--foreground)] font-semibold mb-2">Clause Extraction</h4>
            <p className="text-gray-400 text-sm">Detects termination, payment, arbitration, and confidentiality clauses.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-[var(--foreground)] font-semibold mb-2">Risk Summaries</h4>
            <p className="text-gray-400 text-sm">Summarizes potential risks to help you focus on what matters.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-[var(--foreground)] font-semibold mb-2">Secure Storage</h4>
            <p className="text-gray-400 text-sm">Your files are securely stored and only accessible to you.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-[var(--foreground)] font-semibold mb-2">Fast Analysis</h4>
            <p className="text-gray-400 text-sm">Upload and get highlights in seconds with our optimized pipeline.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-[var(--foreground)] font-semibold mb-2">Export & Share</h4>
            <p className="text-gray-400 text-sm">Download highlights and summaries to share with your team.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-[var(--foreground)] font-semibold mb-2">Multi-format Support</h4>
            <p className="text-gray-400 text-sm">PDF, DOCX, and images are supported out of the box.</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 w-full max-w-5xl mt-16">
        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[var(--foreground)] font-bold">1.</span>
            <h5 className="text-[var(--foreground)] font-semibold mt-2 mb-1">Upload</h5>
            <p className="text-gray-400 text-sm">Drag-and-drop your legal documents to begin.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[var(--foreground)] font-bold">2.</span>
            <h5 className="text-[var(--foreground)] font-semibold mt-2 mb-1">Analyze</h5>
            <p className="text-gray-400 text-sm">Our AI extracts key clauses and summarizes risks.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[var(--foreground)] font-bold">3.</span>
            <h5 className="text-[var(--foreground)] font-semibold mt-2 mb-1">Review</h5>
            <p className="text-gray-400 text-sm">Inspect highlights, export summaries, and re-analyze when needed.</p>
          </div>
        </div>
      </div>

      {/* Use cases */}
      <div className="relative z-10 w-full max-w-5xl mt-16">
        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">Use cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h5 className="text-[var(--foreground)] font-semibold mb-1">Contract review</h5>
            <p className="text-gray-400 text-sm">Speed up redlining by surfacing termination and payment terms.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h5 className="text-[var(--foreground)] font-semibold mb-1">Vendor agreements</h5>
            <p className="text-gray-400 text-sm">Compare key clauses across vendor contracts quickly.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h5 className="text-[var(--foreground)] font-semibold mb-1">Policy audits</h5>
            <p className="text-gray-400 text-sm">Identify risky language across internal policies.</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 w-full max-w-5xl mt-16">
        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">What users say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-300 text-sm">“Cut our contract review time by 60%.”</p>
            <p className="text-gray-500 text-xs mt-2">— In-house Counsel</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-300 text-sm">“The highlights are shockingly accurate.”</p>
            <p className="text-gray-500 text-xs mt-2">— Compliance Lead</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-300 text-sm">“Exactly what we needed for vendor diligence.”</p>
            <p className="text-gray-500 text-xs mt-2">— Procurement Manager</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="relative z-10 w-full max-w-5xl mt-16 mb-20">
        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">FAQ</h3>
        <div className="space-y-3 text-left">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h5 className="text-[var(--foreground)] font-semibold">Is my data secure?</h5>
            <p className="text-gray-400 text-sm mt-1">Yes. Files are stored securely and only accessible to your account.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h5 className="text-[var(--foreground)] font-semibold">Which formats are supported?</h5>
            <p className="text-gray-400 text-sm mt-1">PDF, DOCX, and common image formats like PNG/JPG.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h5 className="text-[var(--foreground)] font-semibold">Can I re-run analysis?</h5>
            <p className="text-gray-400 text-sm mt-1">Yes. You can reanalyze any document from your dashboard.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-sm text-gray-400">
        © {new Date().getFullYear()} Legal Analyzer by Abhinav Saxena. All Rights Reserved.
      </div>
    </div>
  );
};

export default HomePage;

