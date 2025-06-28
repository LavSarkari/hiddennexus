import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQVTZOJeLMl6msGJMsXdqSx7ZI8V1q0cQ",
  authDomain: "nexus-c2e98.firebaseapp.com",
  databaseURL: "https://nexus-c2e98-default-rtdb.firebaseio.com",
  projectId: "nexus-c2e98",
  storageBucket: "nexus-c2e98.firebasestorage.app",
  messagingSenderId: "496552807403",
  appId: "1:496552807403:web:e262c8d3ea3c080fea67ae",
  measurementId: "G-NBW9G7DN81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const rtdb = getDatabase(app);

// Auth providers
export const discordProvider = new OAuthProvider('discord.com');
export const googleProvider = new GoogleAuthProvider();

export default app; 