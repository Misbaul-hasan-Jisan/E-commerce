import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqZXerJpxxtkzfGUQJHAKzKOowTHwQbvE",
  authDomain: "shopper-pro1.firebaseapp.com",
  projectId: "shopper-pro1",
  storageBucket: "shopper-pro1.firebasestorage.app",
  messagingSenderId: "749122879504",
  appId: "1:749122879504:web:082ff2a9694c627fe9ca95",
  measurementId: "G-S8HG4WWB8P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};