
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVfR-lClT3_HBARNQf_FoXcSQnf-I9dm4",
  authDomain: "cbmc-comando-central.firebaseapp.com",
  projectId: "cbmc-comando-central",
  storageBucket: "cbmc-comando-central.firebasestorage.app",
  messagingSenderId: "579182054174",
  appId: "1:579182054174:web:9eb9cc23f47e04c2d1570f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
