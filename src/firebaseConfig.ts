// firebaseConfig.ts
import { initializeApp } from '../server/node_modules/@firebase/app';
import { getDatabase } from '../server/node_modules/@firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual API key
  authDomain: "iotvcc.firebaseapp.com",
  databaseURL: "https://iotvcc-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "iotvcc",
  storageBucket: "iotvcc.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your actual messaging sender ID
  appId: "YOUR_APP_ID" // Replace with your actual app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export the instance
export const database = getDatabase(app);