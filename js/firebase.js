// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDeEpczXdourJY4iZKFVRfLSSHvaeZyoms",
  authDomain: "engineers-classroom.firebaseapp.com",
  projectId: "engineers-classroom",
  storageBucket: "engineers-classroom.firebasestorage.app",
  messagingSenderId: "988938934359",
  appId: "1:988938934359:web:2fa90d876b29da1cd62b12"
};

// ✅ Initialize Firebase ONCE
const app = initializeApp(firebaseConfig);

// ✅ Export instances
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("🔥 Firebase initialized correctly");
