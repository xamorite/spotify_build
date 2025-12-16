// src/auth/useAuth.js
// Global auth context powered by Firebase Authentication + Firestore

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/client";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Subscribe to Firebase auth state
  useEffect(() => {
    if (!auth) {
      setIsAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { uid, email, displayName, photoURL } = firebaseUser;
        const normalizedUser = {
          id: uid,
          uid,
          email,
          name: displayName || email || "",
          photoURL: photoURL || null,
        };
        setUser(normalizedUser);
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!auth) throw new Error("Firebase auth not initialized");
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  };

  const signup = async (email, password) => {
    if (!auth || !db) throw new Error("Firebase not fully initialized");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = cred.user;

    try {
      // Create / merge basic user document in Firestore
      await setDoc(
        doc(db, "users", uid),
        {
          email,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error creating user document:", e);
    }

    return true;
  };

  // Backwards-compatible alias some pages might expect
  const register = (form) => {
    const { email, password } = form || {};
    if (!email || !password) {
      return Promise.reject(
        new Error("Email and password are required to register.")
      );
    }
    return signup(email, password);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const value = {
    user,
    isAuthReady,
    login,
    signup,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
