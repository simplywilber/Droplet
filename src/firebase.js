import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_XKuIh9nsiiH5TxGqWfYb8yuLuIi4lbo",
  authDomain: "droplet-9cde4.firebaseapp.com",
  projectId: "droplet-9cde4",
  storageBucket: "droplet-9cde4.firebasestorage.app",
  messagingSenderId: "936497581995",
  appId: "1:936497581995:web:4bee81026294b01b2a8cee",
  measurementId: "G-XRBVCC1JYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
