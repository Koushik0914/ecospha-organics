// src/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
  signInWithEmailAndPassword, // New: For email/password login
  createUserWithEmailAndPassword, // New: For email/password registration
  GoogleAuthProvider, // New: For Google Sign-in
  signInWithPopup, // New: For Google Sign-in
  signOut, // New: For signing out
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// IMPORTANT: __firebase_config and __initial_auth_token are global variables
// automatically provided by the Canvas environment.
// If you are running this code locally (e.g., via `npm run dev`),
// __firebase_config will be undefined. In that case, you MUST
// paste your actual Firebase configuration here.

let firebaseConfig;

if (typeof __firebase_config !== 'undefined' && __firebase_config) {
  // Use the configuration provided by the Canvas environment
  firebaseConfig = JSON.parse(__firebase_config);
  console.log("Using Firebase config from Canvas environment.");
} else {
  // --- START: PASTE YOUR FIREBASE CONFIG HERE FOR LOCAL DEVELOPMENT ---
  // Go to your Firebase project settings -> "Your apps" -> Select your web app
  // Copy the `firebaseConfig` object and paste it below.
  // Example:
  firebaseConfig = {
        apiKey: "AIzaSyBu_p7gTUYtgfFPdQ8q6eiy3Z0LelR3WQA",
        authDomain: "ecospha-organics.firebaseapp.com",
        projectId: "ecospha-organics",
        storageBucket: "ecospha-organics.firebasestorage.app",
        messagingSenderId: "666095477429",
        appId: "1:666095477429:web:8b852c174b6b79e873d4fc",
        measurementId: "G-VVKD2Y4439",
    // measurementId: "YOUR_MEASUREMENT_ID" // Optional
  };
  // --- END: PASTE YOUR FIREBASE CONFIG HERE FOR LOCAL DEVELOPMENT ---

  console.warn("No __firebase_config found. Using hardcoded config (for local dev). Ensure you've pasted yours!");
  if (!firebaseConfig.projectId) {
    console.error("Firebase 'projectId' is missing in your local config. Please update src/firebase.js with your actual Firebase configuration.");
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to handle Firebase initial authentication (anonymous or custom token)
const setupFirebaseAuth = async () => {
  if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
    try {
      await signInWithCustomToken(auth, __initial_auth_token);
      console.log("Signed in with custom token.");
    } catch (error) {
      console.error("Error signing in with custom token:", error);
      // Fallback to anonymous sign-in if custom token fails
      await signInAnonymously(auth);
      console.log("Signed in anonymously due to custom token failure.");
    }
  } else {
    // If no custom token is provided (e.g., local dev), sign in anonymously
    await signInAnonymously(auth);
    console.log("Signed in anonymously.");
  }
};

// New: Function for email/password login
const signInUser = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// New: Function for email/password registration
const registerUser = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// New: Function for Google Sign-in
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// New: Function for signing out
const signOutUser = async () => {
  return signOut(auth);
};


export {
  db,
  auth,
  setupFirebaseAuth,
  signInUser, // Export new function
  registerUser, // Export new function
  signInWithGoogle, // Export new function
  signOutUser, // Export new function
};
