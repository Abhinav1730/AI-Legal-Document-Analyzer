"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#142B47] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="/"
          className="text-2xl font-extrabold text-[#FFD700] flex items-center space-x-2"
        >
          ⚖️ <span>LegalAI</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              <a
                href="/dashboard"
                className="text-gray-300 hover:text-[#FFD700] transition"
              >
                Dashboard
              </a>
              <span className="text-gray-400">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="px-5 py-2 rounded-lg bg-[#FFD700] text-[#0B1B2B] font-bold shadow-md hover:bg-yellow-400 transition"
            >
              Login
            </a>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-200 hover:text-[#FFD700] focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#0B1B2B] px-6 py-4 space-y-4 shadow-inner">
          {user ? (
            <>
              <a
                href="/dashboard"
                className="block text-gray-300 hover:text-[#FFD700] transition"
              >
                Dashboard
              </a>
              <span className="block text-gray-400">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="w-full px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="block w-full text-center px-4 py-2 rounded-lg bg-[#FFD700] text-[#0B1B2B] font-bold shadow-md hover:bg-yellow-400 transition"
            >
              Login
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
