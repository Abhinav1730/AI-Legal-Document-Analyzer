"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Page = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  React.useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const m = params.get("mode");
    if(m === "register") setMode("register");
  },[]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try{
      if(mode === "login"){
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      window.location.href = "/dashboard";
    }catch(err){
      setError("Authentication failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 elevate">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#FFD700]" placeholder="John Doe"/>
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#FFD700]" placeholder="you@example.com"/>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#FFD700]" placeholder="••••••••"/>
          </div>

          <button type="submit" className="w-full px-4 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition">
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10"/>
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-white/10"/>
        </div>

        <a href={`${BASE_URL}/api/auth/google`} className="block w-full text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white transition text-white">
          Continue with Google
        </a>

        <p className="text-center text-gray-400 text-sm mt-6">
          {mode === "login" ? (
            <>Don't have an account? <button className="text-[#FFD700] hover:underline" onClick={()=>setMode("register")}>Register</button></>
          ) : (
            <>Already have an account? <button className="text-[#FFD700] hover:underline" onClick={()=>setMode("login")}>Login</button></>
          )}
        </p>
      </div>
    </div>
  );
};

export default Page;

