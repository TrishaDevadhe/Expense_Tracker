import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;
if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
}
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const emailSignUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const emailLogin = (email, password) => signInWithEmailAndPassword(auth, email, password);

export const setupRecaptcha = (containerId) => {
  if (!auth) return;
  try {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved
      }
    });
    return window.recaptchaVerifier.render();
  } catch (error) {
    console.error("Recaptcha Setup Error:", error);
    throw error;
  }
};

export const signInWithPhone = async (phoneNumber) => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  
  // Ensure recaptcha is ready
  if (!window.recaptchaVerifier) {
    throw new Error("Recaptcha not initialized. Please try again.");
  }
  
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
  } catch (error) {
    console.error("Phone Sign In error:", error);
    throw error;
  }
};
