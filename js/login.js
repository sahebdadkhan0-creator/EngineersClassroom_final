import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const form = document.getElementById("loginForm");
const toggle = document.getElementById("togglePassword");
const password = document.getElementById("password");

/* Toggle password */
toggle.onclick = () => {
  password.type = password.type === "password" ? "text" : "password";
};

/* Email login */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});

/* Google login */
document.getElementById("googleLogin").onclick = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  window.location.href = "dashboard.html";
};
