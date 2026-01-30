import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const form = document.getElementById("loginForm");
const toggle = document.getElementById("togglePassword");
const passwordEl = document.getElementById("loginPassword");
const emailEl = document.getElementById("loginEmail");

/* Toggle password */
if (toggle && passwordEl) {
  toggle.onclick = () => {
    passwordEl.type = passwordEl.type === "password" ? "text" : "password";
  };
}

/* Email login */
if (form && emailEl && passwordEl) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, emailEl.value, passwordEl.value);
      window.location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* Google login */
const googleBtn = document.getElementById("googleLogin");
if (googleBtn) {
  googleBtn.onclick = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  };
}