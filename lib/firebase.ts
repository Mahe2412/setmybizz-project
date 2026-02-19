import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxA7-JQPGRNyLRBIEHQm2bArjNCF0E0zE",
  authDomain: "setmybizz-platform.firebaseapp.com",
  projectId: "setmybizz-platform",
  storageBucket: "setmybizz-platform.firebasestorage.app",
  messagingSenderId: "670603258670",
  appId: "1:670603258670:web:253f3feb228577ecb368bf",
  measurementId: "G-3WZNQ6GQH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (only in browser)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

import { getStorage } from "firebase/storage";

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export const signInWithGoogleWorkspace = async () => {
  const provider = new GoogleAuthProvider();
  // Add scopes for full workspace integration
  provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
  provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');
  provider.addScope('https://www.googleapis.com/auth/drive.readonly');
  // For user info
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');

  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;

    return { user, token };
  } catch (error) {
    console.error("Error signing in with Google Workspace:", error);
    throw error;
  }
};

// Basic Google Sign In (without workspace scopes)
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return { user };
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    throw new Error(error.message || "Failed to sign in with Google");
  }
};

// Email/Password Sign In
export const signInWithEmailPassword = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user };
  } catch (error: any) {
    console.error("Error signing in with email:", error);
    throw new Error(error.message || "Failed to sign in");
  }
};

// Create Account with Email/Password
export const createUserAccount = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with display name
    if (result.user) {
      await updateProfile(result.user, {
        displayName: displayName
      });
    }

    return { user: result.user };
  } catch (error: any) {
    console.error("Error creating account:", error);
    let message = "Failed to create account";

    if (error.code === 'auth/email-already-in-use') {
      message = "This email is already registered. Please sign in instead.";
    } else if (error.code === 'auth/weak-password') {
      message = "Password is too weak. Please use a stronger password.";
    } else if (error.code === 'auth/invalid-email') {
      message = "Invalid email address.";
    }

    throw new Error(message);
  }
};

export { app, analytics, db, auth, storage };
