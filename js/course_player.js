import { auth, db } from "./firebase.js";
import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Get courseId
const params = new URLSearchParams(window.location.search);
const courseId = params.get("courseId");

let enrollmentDocId = null;
let completedVideos = [];

/* =====================
   AUTH + ENROLL CHECK
===================== */

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Check enrollment
  const enrollQuery = query(
    collection(db, "enrollments"),
    where("userId", "==", user.uid),
    where("courseId", "==", courseId)
  );

  const enrollSnap = await getDocs(enrollQuery);

  if (enrollSnap.empty) {
    document.body.innerHTML = `
      <div class="text-center mt-5">
        <h2>🔒 Course Locked</h2>
        <a href="courses.html" class="btn btn-primary">Enroll Now</a>
      </div>
    `;
    return;
  }

  const enrollDoc = enrollSnap.docs[0];
  enrollmentDocId = enrollDoc.id;
  completedVideos = enrollDoc.data().completedVideos || [];

  loadVideos();
});

/* =====================
   LOAD VIDEOS
===================== */

async function loadVideos() {
  const videoQuery = query(
    collection(db, "videos"),
    where("courseId", "==", courseId)
  );

  const snap = await getDocs(videoQuery);
  const list = document.getElementById("videoList");

  list.innerHTML = "";

  const totalVideos = snap.size;

  snap.forEach(videoDoc => {
    const v = videoDoc.data();
    const isCompleted = completedVideos.includes(videoDoc.id);

    list.innerHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h6>${v.title}</h6>

          <iframe width="100%" height="315"
            src="${v.videoUrl}"
            allowfullscreen></iframe>

          <button
            class="btn btn-${isCompleted ? "success" : "outline-primary"} mt-2"
            ${isCompleted ? "disabled" : ""}
            onclick="markComplete('${videoDoc.id}', ${totalVideos})">
            ${isCompleted ? "Completed ✅" : "Mark as Completed"}
          </button>
        </div>
      </div>
    `;
  });
}

/* =====================
   MARK VIDEO COMPLETE
===================== */

window.markComplete = async function (videoId, totalVideos) {

  if (completedVideos.includes(videoId)) return;

  completedVideos.push(videoId);

  const progress = Math.round(
    (completedVideos.length / totalVideos) * 100
  );

  await updateDoc(doc(db, "enrollments", enrollmentDocId), {
    completedVideos,
    progress
  });

  alert("Progress saved!");
  loadVideos();
};
