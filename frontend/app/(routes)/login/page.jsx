"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

const Page = () => {
  const { login, register, user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  React.useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const m = params.get("mode");
    if(m === "register") setMode("register");
  },[]);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setError(t("auth.email_required"));
      setLoading(false);
      return;
    }
    
    if (mode === "register" && !name.trim()) {
      setError(t("auth.name_required"));
      setLoading(false);
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    
    // Password length validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    
    try{
      if(mode === "login"){
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      window.location.href = "/dashboard";
    }catch(err){
      console.error('Authentication error:', err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 elevate text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 elevate">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {mode === "login" ? t("auth.welcome_back") : t("auth.create_account")}
        </h2>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">{t("auth.name")}</label>
              <input 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#FFD700]" 
                placeholder="John Doe"
                disabled={loading}
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-300 mb-1">{t("auth.email")}</label>
            <input 
              type="email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#FFD700]" 
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">{t("auth.password")}</label>
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#FFD700]" 
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span>{mode === "login" ? "Logging in..." : "Creating account..."}</span>
              </div>
            ) : (
              mode === "login" ? t("auth.login") : t("auth.create_account_btn")
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10"/>
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-white/10"/>
        </div>

        <a 
          href={`${BASE_URL}/api/auth/google`} 
          className="block w-full text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white transition text-white disabled:opacity-50"
          disabled={loading}
        >
          {t("auth.continue_with_google")}
        </a>

        <p className="text-center text-gray-400 text-sm mt-6">
          {mode === "login" ? (
            <>{t("auth.no_account")} <button className="text-[#FFD700] hover:underline" onClick={()=>setMode("register")} disabled={loading}>{t("auth.register")}</button></>
          ) : (
            <>{t("auth.have_account")} <button className="text-[#FFD700] hover:underline" onClick={()=>setMode("login")} disabled={loading}>{t("auth.login")}</button></>
          )}
        </p>
      </div>
    </div>
  );
};

export default Page;

