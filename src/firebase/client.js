// src/firebase/client.js
// Centralized Firebase initialization for client-side usage

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// All values are pulled from public env vars so they work in the browser.
// Make sure to define these in your .env.local:
// NEXT_PUBLIC_FIREBASE_API_KEY=...
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
// NEXT_PUBLIC_FIREBASE_APP_ID=...

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Guard against missing config so the app fails loudly in dev
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId;

let app;

if (isConfigValid) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} else {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.error(
      "[Firebase] Missing config. Check NEXT_PUBLIC_FIREBASE_* environment variables."
    );
  }
}

export const firebaseApp = app;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;


