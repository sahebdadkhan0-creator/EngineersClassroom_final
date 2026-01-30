import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const form = document.getElementById("signupForm");
const toggle = document.getElementById("togglePassword");
const password = document.getElementById("password");

/* Toggle password */
toggle.onclick = () => {
  password.type = password.type === "password" ? "text" : "password";
};

/* Email signup */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    await setDoc(doc(db, "users", cred.user.uid), {
      name: name.value,
      email: email.value,
      role: "student",
      createdAt: serverTimestamp()
    });

    window.location.href = "dashboard.html";

  } catch (err) {
    alert(err.message);
  }
});

/* Google signup */
document.getElementById("googleSignup").onclick = async () => {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);

  await setDoc(
    doc(db, "users", cred.user.uid),
    {
      name: cred.user.displayName,
      email: cred.user.email,
      role: "student",
      createdAt: serverTimestamp()
    },
    { merge: true }
  );

  window.location.href = "dashboard.html";
};
