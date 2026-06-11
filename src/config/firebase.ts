import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD79NFlsLICUACaRdJt_0DQ0iiHLAsrfnc",
  authDomain: "expense-tracker-db3b8.firebaseapp.com",
  projectId: "expense-tracker-db3b8",
  storageBucket: "expense-tracker-db3b8.firebasestorage.app",
  messagingSenderId: "236966895085",
  appId: "1:236966895085:web:3b7c4ee89804ed656d5be4"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

// Helper function to sign in anonymously
export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in anonymously: ", error);
    throw error;
  }
};
