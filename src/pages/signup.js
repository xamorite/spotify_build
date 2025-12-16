// app/register/page.js
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      // Sync with Spotify immediately (redirect to Spotify Auth)
      window.location.href = "/api/auth/login";
    } catch (err) {
      console.error("Registration failed:", err);
      alert(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-black/55 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-white">Full Name</label>
            <input type="text" name="name" required value={form.name} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white">Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white">Password</label>
            <input type="password" name="password" required value={form.password} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-950 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <div className="text-sm text-center">
          Already have an account? <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500"> Sign in</Link>
        </div>
      </div>
    </div>
  );
}