import { auth, db } from "./firebase.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document.querySelectorAll(".enroll-btn").forEach(btn => {
  btn.addEventListener("click", async () => {

    if (!auth.currentUser) {
      alert("Please login first");
      window.location.href = "login.html";
      return;
    }

    const courseId = btn.dataset.courseId;
    const courseTitle = btn.dataset.courseTitle;
    const courseType = btn.dataset.courseType;

    // 🔒 PAID CHECK (payment later)
    if (courseType === "paid") {
      alert("Payment integration coming soon");
      return;
    }

    // 🔍 Prevent duplicate enrollment
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", auth.currentUser.uid),
      where("courseId", "==", courseId)
    );

    const snap = await getDocs(q);
    if (!snap.empty) {
      alert("Already enrolled");
      return;
    }

    // ✅ Enroll
    await addDoc(collection(db, "enrollments"), {
      userId: auth.currentUser.uid,
      courseId,
      courseTitle,
      progress: 0,
      enrolledAt: serverTimestamp()
    });

    alert("Enrolled successfully!");
    window.location.href = "dashboard.html";
  });
});
