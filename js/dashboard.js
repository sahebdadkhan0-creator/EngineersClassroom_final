import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* =========================
   DOM ELEMENTS
========================= */

const studentName = document.getElementById("studentName");
const courseCount = document.getElementById("courseCount");
const practiceHours = document.getElementById("practiceHours");
const progressPercent = document.getElementById("progressPercent");

const currentCourse = document.getElementById("currentCourse");
const courseProgress = document.getElementById("courseProgress");

const liveClassTitle = document.getElementById("liveClassTitle");
const liveClassTime = document.getElementById("liveClassTime");

/* =========================
   AUTH + ROLE PROTECTION
========================= */

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // 🔐 Fetch user document
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("User profile not found");
    await signOut(auth);
    window.location.href = "login.html";
    return;
  }

  const userData = userSnap.data();

  // 🚫 BLOCK TEACHERS
  if (userData.role !== "student") {
    window.location.href = "index.html";
    return;
  }

  /* =========================
     USER INFO
  ========================= */

  studentName.innerText = userData.name || user.email;
  practiceHours.innerText = `${userData.practiceHours || 0}h`;

  /* =========================
     ENROLLMENTS
  ========================= */

  const enrollQuery = query(
    collection(db, "enrollments"),
    where("userId", "==", user.uid)
  );

  const enrollSnap = await getDocs(enrollQuery);

  // Total courses
  courseCount.innerText = enrollSnap.size;

  if (!enrollSnap.empty) {
    const courseData = enrollSnap.docs[0].data();

    currentCourse.innerText = courseData.courseTitle;
    courseProgress.style.width = `${courseData.progress}%`;
    progressPercent.innerText = `${courseData.progress}%`;
  } else {
    currentCourse.innerText = "No course enrolled";
    courseProgress.style.width = "0%";
    progressPercent.innerText = "0%";
  }

  /* =========================
     LIVE CLASS
  ========================= */

  const liveSnap = await getDocs(collection(db, "liveClasses"));

  if (!liveSnap.empty) {
    const live = liveSnap.docs[0].data();
    liveClassTitle.innerText = live.title;
    liveClassTime.innerText = live.time;
  } else {
    liveClassTitle.innerText = "No upcoming class";
    liveClassTime.innerText = "";
  }
});

/* =========================
   LOGOUT
========================= */

window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};
