// app/profile-setup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../auth/useAuth";
import { db } from "../firebase/client";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Initialize with empty strings for the fields expected by UserProfile.java
  const [form, setForm] = useState({ 
    fullName: '', 
    bio: '', 
    profilePictureUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!db || !user?.uid) {
      setError("User session not found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: form.fullName.trim(),
        bio: form.bio.trim(),
        profilePictureUrl: form.profilePictureUrl.trim(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), payload, { merge: true });

      alert("Profile details saved successfully! Welcome!");
      router.push("/home");
    } catch (err) {
      console.error("Profile setup failed:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-black/55 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white">
          Complete Your Profile
        </h2>
        <p className="text-gray-400 text-center text-sm">
            Just a few more details to get started.
        </p>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-white">Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              required 
              value={form.fullName} 
              onChange={handleChange}
              placeholder="e.g., Alex Johnson"
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-white">Bio (Optional)</label>
            <textarea 
              name="bio" 
              value={form.bio} 
              onChange={handleChange}
              rows="3"
              placeholder="e.g., Music lover, sound explorer, and groove finder."
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Profile Picture URL */}
          <div>
            <label className="block text-sm font-medium text-white">Profile Picture URL (Optional)</label>
            <input 
              type="url" 
              name="profilePictureUrl" 
              value={form.profilePictureUrl} 
              onChange={handleChange}
              placeholder="https://your-image.com/pic.jpg"
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-white rounded-md transition-colors ${
                isLoading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-blue-950 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Profile & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}