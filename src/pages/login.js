// app/login/page.js
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // FIX: Make this function asynchronous and await the login result
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
        await login(email, password);
        // Sync with Spotify immediately (redirect to Spotify Auth)
        window.location.href = "/api/auth/login";
    } catch (err) {
        console.error("Login component error:", err);
        setError(err.message || "An unexpected error occurred during login.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-blue text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-black/80 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white">Sign In</h2>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting} // Disable button while submitting
            className={`w-full py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                isSubmitting 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            }`}
          >
            {isSubmitting ? "Logging In..." : "Log In"}
          </button>
        </form>

        <div className="flex items-center justify-between">
          {/* 3. Forgot Password Link */}
          <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </Link>
          <Link href="/signup" className="text-sm text-gray-600 hover:text-gray-700">
            Need an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}