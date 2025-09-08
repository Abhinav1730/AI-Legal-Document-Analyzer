"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="/"
          className="text-2xl font-extrabold text-white flex items-center space-x-2 hover:opacity-90 transition"
        >
          ⚖️ <span>LegalAI</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="px-3 py-2 rounded-lg bg-white/5 text-white border border-white/10 hover:border-white transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <>
              <a
                href="/dashboard"
                className="text-gray-300 hover:text-white transition"
              >
                Dashboard
              </a>
              <span className="px-3 py-1 rounded-full text-sm bg-white/5 text-gray-300 border border-white/10">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-700 text-white font-semibold hover:from-neutral-700 hover:to-neutral-600 transition shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login?mode=register"
                className="px-5 py-2 rounded-lg bg-white text-black font-bold shadow-md hover:bg-neutral-200 transition glow"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="px-5 py-2 rounded-lg bg-white/5 text-white border border-white/10 font-semibold hover:border-white transition"
              >
                Login
              </a>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="px-3 py-2 rounded-lg bg-white/5 text-white border border-white/10 hover:border-white transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-200 hover:text-white focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black/70 backdrop-blur-xl px-6 py-4 space-y-4 border-t border-white/10">
          {user ? (
            <>
              <a
                href="/dashboard"
                className="block text-gray-300 hover:text-white transition"
              >
                Dashboard
              </a>
              <span className="block text-gray-400">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-700 text-white font-semibold hover:from-neutral-700 hover:to-neutral-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login?mode=register"
                className="block w-full text-center px-4 py-2 rounded-lg bg-white text-black font-bold shadow-md hover:bg-neutral-200 transition glow"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="block w-full text-center px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10 font-semibold hover:border-white transition mt-2"
              >
                Login
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
