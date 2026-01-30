import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* =======================
   DOM ELEMENTS
======================= */

const teacherEmail = document.getElementById("teacherEmail");

const courseForm = document.getElementById("courseForm");
const courseTitle = document.getElementById("courseTitle");
const courseDescription = document.getElementById("courseDescription");
const courseType = document.getElementById("courseType");
const courseList = document.getElementById("courseList");

const videoForm = document.getElementById("videoForm");
const videoCourse = document.getElementById("videoCourse");
const videoTitle = document.getElementById("videoTitle");
const videoUrl = document.getElementById("videoUrl");
const videoOrder = document.getElementById("videoOrder");

/* =======================
   AUTH PROTECTION
======================= */

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userSnap = await getDoc(doc(db, "users", user.uid));

  if (!userSnap.exists() || userSnap.data().role !== "teacher") {
    alert("Access denied");
    window.location.href = "index.html";
    return;
  }

  teacherEmail.innerText = user.email;
  loadCourses(user.uid);
});

/* =======================
   CREATE COURSE
======================= */

if (courseForm) {
  courseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "courses"), {
        title: courseTitle.value,
        description: courseDescription.value,
        type: courseType.value,
        instructorId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });

      alert("Course created successfully");
      courseForm.reset();
      loadCourses(auth.currentUser.uid);

    } catch (err) {
      alert(err.message);
    }
  });
}

/* =======================
   LOAD COURSES
======================= */

async function loadCourses(uid) {
  const q = query(
    collection(db, "courses"),
    where("instructorId", "==", uid)
  );

  const snap = await getDocs(q);

  courseList.innerHTML = "";
  videoCourse.innerHTML = `<option value="">Select Course</option>`;

  if (snap.empty) {
    courseList.innerHTML = "<p class='text-muted'>No courses yet</p>";
    return;
  }

  snap.forEach(docSnap => {
    const c = docSnap.data();

    courseList.innerHTML += `
      <div class="border rounded p-3 mb-2">
        <h6 class="fw-bold">${c.title}</h6>
        <p class="mb-1">${c.description}</p>
        <span class="badge bg-${c.type === "free" ? "success" : "warning"}">
          ${c.type.toUpperCase()}
        </span>
      </div>
    `;

    videoCourse.innerHTML += `
      <option value="${docSnap.id}">
        ${c.title}
      </option>
    `;
  });
}

/* =======================
   ADD VIDEO (METADATA)
======================= */

if (videoForm) {
  videoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "videos"), {
        courseId: videoCourse.value,
        title: videoTitle.value,
        videoUrl: videoUrl.value,
        order: Number(videoOrder.value),
        instructorId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });

      alert("Video added successfully");
      videoForm.reset();

    } catch (err) {
      alert(err.message);
    }
  });
}

/* =======================
   LOGOUT
======================= */

window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};
