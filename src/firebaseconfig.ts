// firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// ✅ Replace the placeholder values with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "iotvcc.firebaseapp.com",
  databaseURL: "https://iotvcc-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "iotvcc",
  storageBucket: "iotvcc.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the Realtime Database instance
export const database = getDatabase(app);
