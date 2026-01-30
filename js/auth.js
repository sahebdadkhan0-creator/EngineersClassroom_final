import { auth, db } from "./firebase.js";


import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* ============================
   STUDENT SIGNUP ONLY
============================ */

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
try {
  console.log("🟡 Starting signup");

  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  console.log("🟢 Auth success", userCred.user.uid);

  console.log("🟠 About to write Firestore");

  await setDoc(
    doc(db, "users", userCred.user.uid),
    {
      email: email,
      role: "student",
      createdAt: new Date().toISOString()
    },
    { merge: true }
  );

  console.log("🟢 Firestore write success");

  alert("Signup successful!");
  window.location.href = "dashboard.html";

} catch (error) {
  console.error("❌ FIRESTORE ERROR FULL OBJECT:", error);
  console.error("❌ MESSAGE:", error.message);
  console.error("❌ CODE:", error.code);
  alert(error.message);
}


  });
}
/* ============================
   LOGIN (ROLE BASED REDIRECT)
============================ */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      // 🔥 GET ROLE FROM FIRESTORE
      const userDoc = await getDoc(doc(db, "users", userCred.user.uid));

      if (!userDoc.exists()) {
        alert("User role not found");
        return;
      }

      const role = userDoc.data().role;

      // ✅ ROLE-BASED REDIRECT
      if (role === "teacher") {
        window.location.href = "instructor.html";
      } else {
        window.location.href = "dashboard.html";
      }

    } catch (err) {
      alert(err.message);
    }
  });
}


/* ============================
   AUTH GUARD (PROTECTION)
============================ */

export function protectPage(allowedRole) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists() || snap.data().role !== allowedRole) {
      alert("Access denied");
      window.location.href = "index.html";
    }
  });
}
