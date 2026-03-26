import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration object.
 * All values are loaded from environment variables for security.
 * Get these values from your Firebase Console > Project Settings > General > Your apps.
 *
 * Required environment variables in .env file:
 * - VITE_FIREBASE_API_KEY: Your Firebase project's API key
 * - VITE_FIREBASE_AUTH_DOMAIN: Your project's auth domain (project-id.firebaseapp.com)
 * - VITE_FIREBASE_PROJECT_ID: Your Firebase project ID
 * - VITE_FIREBASE_STORAGE_BUCKET: Your storage bucket (project-id.appspot.com)
 * - VITE_FIREBASE_MESSAGING_SENDER_ID: Your messaging sender ID
 * - VITE_FIREBASE_APP_ID: Your app ID
 * - VITE_FIREBASE_MEASUREMENT_ID: Your measurement ID (optional, for Analytics)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Export Firebase services for use throughout the application
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
