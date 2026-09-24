

/* ================= DATA ================= */
const ROLE_META = {
  student: { label: "Student Portal", name: "Aarav Sharma", sub: "Class 12 · Batch IIT-A", initial: "A" },
  parent: { label: "Parent Portal", name: "Mr. Rakesh Sharma", sub: "Parent of Aarav Sharma", initial: "R" },
  teacher: { label: "Teacher Portal", name: "Ms. Priya Mehta", sub: "Physics · 4 batches", initial: "P" },
  admin: { label: "Admin Panel", name: "Front Office", sub: "Vertex Academy, Kota", initial: "F" },
};

const NAV = {
  student: [
    ["dashboard", "🏠", "Dashboard"], ["timetable", "🗓️", "Timetable"], ["attendance", "✅", "Attendance"],
    ["homework", "📝", "Homework"], ["notes", "📒", "Daily Notes"], ["lectures", "🎥", "Recorded Lectures"],
    ["tests", "🧪", "Tests"], ["results", "📊", "Test Results"], ["fees", "💳", "Fees Status"],
    ["doubts", "💬", "Ask Doubts"], ["aichat", "✨", "AI Chat"],
  ],
  parent: [
    ["dashboard", "🏠", "Dashboard"], ["liveattendance", "✅", "Live Attendance"], ["fees", "💳", "Fees"],
    ["performance", "📈", "Performance"], ["homeworkstatus", "📝", "Homework Status"], ["remarks", "🗒️", "Teacher Remarks"],
    ["monthly", "📰", "Monthly Report"], ["exams", "🧪", "Upcoming Exams"], ["notice", "📌", "Notice Board"], ["chat", "💬", "Chat with Teachers"],
  ],
  teacher: [
    ["dashboard", "🏠", "Dashboard"], ["markattendance", "✅", "Mark Attendance"], ["uploadhomework", "📝", "Upload Homework"],
    ["uploadnotes", "📒", "Upload Notes"], ["uploadvideos", "🎥", "Upload Videos"], ["generatetests", "🧪", "Generate Tests"],
    ["checkhomework", "🗂️", "Check Homework"], ["replydoubts", "💬", "Reply Doubts"], ["analytics", "📊", "View Analytics"], ["messageparents", "✉️", "Message Parents"],
  ],
  admin: [
    ["dashboard", "🏠", "Dashboard"],
    ["admissions", "🧾", "Admissions"],

    ["students", "🎓", "Manage Students"],
    ["teachers", "🧑‍🏫", "Teachers"],

    ["subjects", "📚", "Subjects"],
    ["assignments", "📝", "Teacher Assignment"],

    ["classes", "🏷️", "Create Classes"],
    ["batches", "👥", "Create Batches"],

    ["timetable", "🗓️", "Timetable"],

    ["feecollection", "💳", "Fee Collection"],

    ["notices", "📌", "Upload Notices"],
    ["reports", "📑", "Reports"],
    ["analytics", "📊", "Analytics"],
  ],
};

let state = { role: "student", section: "dashboard" };
let currentSelectedRole = "student";

/* ================= LOGIN ================= */
document.querySelectorAll(".role-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    document
      .querySelectorAll(".role-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    currentSelectedRole = btn.dataset.role;

    document.getElementById("login-role-label").textContent =
      currentSelectedRole.charAt(0).toUpperCase() +
      currentSelectedRole.slice(1);

  });

});

async function doLogin() {

  const phone = document
    .getElementById("login-id")
    .value
    .trim();

  const password = document
    .getElementById("login-pw")
    .value;

  if (!phone || !password) {

    showToast("Enter phone and password");

    return;

  }

  try {

    const result = await apiRequest(
      "/auth/login",
      "POST",
      {
        phone,
        password
      }
    );

    const actualRole = result.user.role.toLowerCase();

    // Replace currentSelectedRole with the variable
    // your UI uses for the selected card.
    if (currentSelectedRole !== actualRole) {

      showToast("Selected role doesn't match your account.");

      return;

    }

    localStorage.setItem("token", result.token);

    localStorage.setItem("user", JSON.stringify(result.user));

    state.role = actualRole;

    state.section = NAV[state.role][0][0];

    document.getElementById("login-screen").style.display = "none";

    document.getElementById("app-screen").style.display = "block";

    document.getElementById("user-name").textContent =
      result.user.name;

    document.getElementById("user-sub").textContent =
      result.user.role;

    document.getElementById("user-avatar").textContent =
      result.user.name.charAt(0);

    document.getElementById("role-pill").textContent =
      ROLE_META[state.role].label;

    buildNav();

    await renderSection();

    showToast("Welcome " + result.user.name);

  } catch (error) {

    showToast(error.message);

  }

}

function doLogout() {

  localStorage.removeItem("token");

  localStorage.removeItem("user");

  document.getElementById("app-screen").style.display = "none";

  document.getElementById("login-screen").style.display = "flex";

  showToast("Logged Out");

}

async function loadDashboardStats() {

  try {

    const result = await apiRequest("/dashboard/stats");

    const stats = result.stats;

    const admissionBox = document.getElementById("recentAdmissions");

    if (admissionBox) {

      admissionBox.innerHTML = "";

      result.admissions.forEach(a => {

        admissionBox.innerHTML += `
            <div class="list-item">

                <div>

                    <strong>${a.student_name}</strong><br>

                    ${a.class_applied}

                </div>

                <span>${a.status}</span>

            </div>
        `;

      });

    }

    document.getElementById("studentCount").textContent =
      stats.students;

    document.getElementById("teacherCount").textContent =
      stats.teachers;

    const parentElement = document.getElementById("parentCount");

    if (parentElement) {
      parentElement.textContent = stats.parents;
    }

    const admissionElement = document.getElementById("admissionCount");

    if (admissionElement) {
      admissionElement.textContent = stats.admissions;
    }

    const feeElement = document.getElementById("feeCollected");
    if (feeElement) {
      feeElement.textContent = "₹" + Number(stats.fees).toLocaleString("en-IN");
    }

    const attendanceElement = document.getElementById("attendanceCount");
    if (attendanceElement) {
      attendanceElement.textContent = stats.attendance + "%";
    }

  } catch (err) {

    console.error(err);

    showToast("Unable to load dashboard");

  }

}



function toggleNotif() {
  document.getElementById("notif-dropdown").classList.toggle("show");
}
// Find this block in script.js (around line 250)
document.addEventListener("click", (e) => {
  const dropdown = document.getElementById("notif-dropdown");
  
  // Only proceed if the dropdown actually exists on the page
  if (dropdown && !e.target.closest(".bell") && !e.target.closest(".notif-dropdown")) {
    dropdown.classList.remove("show");
  }
});

function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toast-text").textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}


/* ================= RENDER HELPERS ================= */
function pillFor(status) {
  const map = {
    Present: "good", Checked: "good", Submitted: "info", Pending: "bad", Absent: "bad", Late: "accent",
    "Result out": "good", Upcoming: "info", Paid: "good", Due: "bad", New: "accent", Confirmed: "good", Answered: "good"
  };
  return `<span class="pill ${map[status] || 'info'}">${status}</span>`;
}

function setTitle(t, c) {
  document.getElementById("page-title").textContent = t;
  document.getElementById("page-crumb").textContent = c;
}

/* ================= SECTION RENDERERS ================= */

/* ---- STUDENT ---- */
async function student_dashboard() {
  setTitle("Dashboard", "Welcome back — here's today at a glance");

  try {
    const result = await loadStudentDashboard();
    const data = result.data;

    // Safely format the test score
    const scoreDisplay = data.lastScore !== null ? `${data.lastScore}%` : "N/A";

    return `
        <div class="grid g4" style="margin-bottom:18px;">
            <div class="card stat-card"><div class="lbl">Attendance (month)</div><div class="val">${data.attendancePct}%</div><div class="delta up">Live Data</div></div>
            <div class="card stat-card"><div class="lbl">Pending homework</div><div class="val ${data.pendingHomework > 0 ? 'accent' : 'good'}">${data.pendingHomework}</div><div class="delta down">Check subjects</div></div>
            <div class="card stat-card"><div class="lbl">Last test score</div><div class="val">${scoreDisplay}</div><div class="delta up">Recent Result</div></div>
            <div class="card stat-card"><div class="lbl">Fees due</div><div class="val">₹${Number(data.feesDue).toLocaleString('en-IN')}</div><div class="delta down">Pending Dues</div></div>
        </div>
        
        <div class="grid g2">
            <div class="card">
                <h3>Today's Timetable</h3>
                ${data.timetable.length === 0 ? `<p style="color:var(--ink-soft); font-size:13px; margin-top:10px;">No classes scheduled for today.</p>` :
        data.timetable.map(t => `
                    <div class="ledger-row" style="align-items:center;">
                        <div class="left">
                            <span class="tag" style="background:var(--primary); color:white;">${t.start_time.substring(0, 5)}</span>
                            <strong>${t.subject_name}</strong>
                        </div>
                        <span style="color:var(--ink-soft); font-size:12.5px;">${t.teacher_name}</span>
                    </div>
                `).join("")}
            </div>
            
            <div class="card">
                <h3>Recent Activity</h3>
                <div class="timeline-item"><div class="t-dot">👋</div><div class="t-body"><strong>Welcome to Aryavart ERP</strong><span>Portal access granted</span></div></div>
                <div class="timeline-item"><div class="t-dot">📌</div><div class="t-body"><strong>Data Synced</strong><span>Your dashboard is now live connected to the database.</span></div></div>
            </div>
        </div>`;
  } catch (err) {
    return `<div class="card">Error loading dashboard: ${err.message}</div>`;
  }
}
async function student_timetable() {
  setTitle("Timetable", "Your weekly class schedule");

  try {
    const result = await loadStudentTimetable();
    const tt = result.timetable;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let html = `<div class="grid g3">`; // Using a 3-column grid for the days

    days.forEach(day => {
      const dayClasses = tt.filter(c => c.day_name === day);

      html += `<div class="card" style="min-height: 250px;">
                        <h3 style="margin-bottom:15px; border-bottom:1px solid var(--line); padding-bottom:10px;">${day}</h3>`;

      if (dayClasses.length > 0) {
        html += dayClasses.map(c => `
                    <div class="ledger-row" style="padding: 12px 0; align-items: flex-start;">
                        <div class="left" style="gap: 12px;">
                            <span class="tag" style="background:var(--primary); color:white; width:65px; text-align:center; padding: 4px 0;">${c.start_time.substring(0, 5)}</span>
                            <div style="display:flex; flex-direction:column; gap: 4px;">
                                <strong style="font-size:14.5px;">${c.subject_name}</strong>
                                <span style="font-size:12.5px; color:var(--ink-soft);">👨‍🏫 ${c.teacher_name}</span>
                                <span style="font-size:11.5px; color:var(--ink-soft);">⏱️ ${c.start_time.substring(0, 5)} - ${c.end_time.substring(0, 5)}</span>
                            </div>
                        </div>
                    </div>
                `).join("");
      } else {
        html += `<div style="color:var(--ink-soft); font-size:13px; text-align:center; margin-top:20px;">No classes scheduled.</div>`;
      }

      html += `</div>`;
    });

    html += `</div>`;
    return html;

  } catch (err) {
    return `<div class="card">Error loading timetable: ${err.message}</div>`;
  }
}
async function student_attendance() {
  setTitle("Attendance", "Track your presence and missed classes");

  try {
    const result = await loadStudentAttendance();
    const data = result.data;

    // Update the subtitle dynamically based on their percentage
    const subtitleMsg = data.stats.monthPct >= 75 ? `${data.stats.monthPct}% present this month — keep it up!` : `${data.stats.monthPct}% present this month — you need to improve this.`;
    setTitle("Attendance", subtitleMsg);

    return `
        <div class="grid g3" style="margin-bottom:18px;">
            <div class="card stat-card">
                <div class="lbl">This month</div>
                <div class="val ${data.stats.monthPct < 75 ? 'bad' : ''}">${data.stats.monthPct}%</div>
            </div>
            <div class="card stat-card">
                <div class="lbl">Overall (This term)</div>
                <div class="val">${data.stats.overallPct}%</div>
            </div>
            <div class="card stat-card">
                <div class="lbl">Classes missed</div>
                <div class="val ${data.stats.classesMissed > 5 ? 'accent' : ''}">${data.stats.classesMissed}</div>
            </div>
        </div>
        
        <div class="card">
            <h3>Recent Log</h3>
            ${data.logs.length === 0 ? `<p style="color:var(--ink-soft); font-size:13px; margin-top:10px;">No attendance records found yet.</p>` :
        `<div style="display:flex; flex-direction:column; gap:8px; margin-top:15px;">
                ${data.logs.map(log => `
                    <div class="ledger-row" style="align-items:center;">
                        <div class="left" style="display:flex; flex-direction:column; gap:4px;">
                            <strong>${new Date(log.attendance_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</strong>
                            <span style="font-size:12.5px; color:var(--ink-soft);">${log.subject_name} (with ${log.teacher_name})</span>
                        </div>
                        ${pillFor(log.status)}
                    </div>
                `).join("")}
            </div>`}
        </div>`;
  } catch (err) {
    return `<div class="card">Error loading attendance: ${err.message}</div>`;
  }
}
async function student_homework() {
  setTitle("Homework", "Assignments across all subjects");
  try {
    const result = await getStudentHomeworkList();
    const assignments = result.homework;

    return `<div class="grid g2" style="margin-bottom: 20px;">
            ${assignments.length === 0 ? `<p>No homework assigned.</p>` : assignments.map(h => {

      const isSubmitted = h.submission_status && h.submission_status !== 'Pending';
      let statusPill = pillFor(h.submission_status || "Pending");

      return `
                <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <div>
                                <h3>${h.title}</h3>
                                <div style="font-size:12.5px; color:var(--ink-soft); margin-bottom:10px;">
                                    ${h.subject_name} · ${h.teacher_name}
                                </div>
                            </div>
                            ${statusPill}
                        </div>
                        <p style="font-size:13.5px; margin-bottom:15px; color:var(--ink);">${h.description}</p>
                        <div class="ledger-row" style="background:var(--bg); border:1px solid var(--line); border-radius:6px; padding:8px 12px; margin-bottom:15px;">
                            <span style="font-size:12.5px; font-weight:600;">Due: ${new Date(h.due_date).toLocaleDateString()}</span>
                            ${h.attachment ? `<a href="${API_URL.replace('/api', '')}${h.attachment}" target="_blank" class="btn-sm secondary">View Attachment</a>` : `<span style="font-size:12px; color:var(--ink-soft);">No attachment</span>`}
                        </div>
                    </div>

                    ${isSubmitted ? `
                        <div style="background:var(--good-bg); padding:12px; border-radius:8px; border:1px solid var(--good);">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <strong>Submitted Document</strong>
                                <a href="${API_URL.replace('/api', '')}${h.file_path}" target="_blank" class="btn-sm solid">View File</a>
                            </div>
                            ${h.teacher_marks ? `
                                <div style="margin-top:10px; padding-top:10px; border-top:1px solid rgba(0,0,0,0.1);">
                                    <strong>Marks: <span style="color:var(--primary);">${h.teacher_marks}</span></strong><br>
                                    <span style="font-size:13px;">Feedback: ${h.teacher_feedback || "None"}</span>
                                </div>
                            ` : `<div style="font-size:12.5px; color:var(--ink-soft); margin-top:8px;">Awaiting evaluation</div>`}
                            <button class="btn-sm warning full-width" style="margin-top:12px;" onclick="openHomeworkUploadModal(${h.homework_id}, true)">Replace Submission</button>
                        </div>
                    ` : `
                        <button class="btn primary full-width" onclick="openHomeworkUploadModal(${h.homework_id}, false)">Upload Submission</button>
                    `}
                </div>
                `;
    }).join("")}
        </div>
        <div id="hwModalContainer"></div>
        `;
  } catch (err) {
    return `<div class="card">Error loading homework: ${err.message}</div>`;
  }
}

function openHomeworkUploadModal(hwId, isReplace) {
  document.getElementById("hwModalContainer").innerHTML = `
    <div class="modal" style="display:flex;">
        <div class="modal-box">
            <h2>${isReplace ? 'Replace' : 'Upload'} Homework</h2>
            <input type="hidden" id="upload-hw-id" value="${hwId}">
            <label>Select File (PDF, Image)</label>
            <input type="file" id="upload-hw-file" class="full-width" style="margin-bottom:15px;">
            <label>Remarks (Optional)</label>
            <textarea id="upload-hw-remarks" class="full-width" rows="3" placeholder="Any note for the teacher..."></textarea>
            <div style="display:flex; gap:10px; margin-top:20px;">
                <button class="btn primary" onclick="submitHomeworkProcess()">Submit</button>
                <button class="btn secondary" onclick="document.getElementById('hwModalContainer').innerHTML=''">Cancel</button>
            </div>
        </div>
    </div>`;
}

async function submitHomeworkProcess() {
  const hwId = document.getElementById("upload-hw-id").value;
  const file = document.getElementById("upload-hw-file").files[0];
  const remarks = document.getElementById("upload-hw-remarks").value;

  if (!file) return showToast("Please select a file to upload");

  const formData = new FormData();
  formData.append("homework_id", hwId);
  formData.append("file", file);
  formData.append("remarks", remarks);

  try {
    showToast("Uploading...");
    await submitStudentHomework(formData);
    showToast("Homework Submitted Successfully!");
    document.getElementById("hwModalContainer").innerHTML = "";
    document.getElementById("content").innerHTML = await student_homework();
  } catch (err) {
    showToast(err.message);
  }
}
async function student_notes() {
  setTitle("Daily Notes", "Study materials and notes uploaded by your teachers");

  try {
    const result = await loadStudentNotes();
    const notes = result.notes;

    if (notes.length === 0) {
      return `<div class="card"><p style="color:var(--ink-soft); font-size:13.5px;">No notes have been uploaded for your classes yet.</p></div>`;
    }

    return `<div class="grid g3">
            ${notes.map(n => `
                <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <div style="font-size:24px; margin-bottom:8px;">📒</div>
                        <h3 style="margin-top:0;">${n.title}</h3>
                        ${n.description ? `<p style="font-size:13px; color:var(--ink); margin-top:6px; line-height:1.4;">${n.description}</p>` : ''}
                        
                        <div style="font-size:12px; color:var(--ink-soft); margin-top:12px; margin-bottom:16px;">
                            <strong>${n.subject_name}</strong> · ${n.teacher_name}<br>
                            <span style="display:inline-block; margin-top:4px;">📅 Uploaded: ${new Date(n.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <a href="${API_URL.replace('/api', '')}${n.file_path}" target="_blank" class="btn-sm solid" style="text-align:center; text-decoration:none;">Download / View PDF</a>
                </div>
            `).join("")}
        </div>`;
  } catch (err) {
    return `<div class="card">Error loading notes: ${err.message}</div>`;
  }
}
async function student_lectures() {
  setTitle("Recorded Lectures", "Catch up on any class you missed");

  try {
    const result = await loadStudentVideos();
    const videos = result.videos;

    if (videos.length === 0) {
      return `<div class="card"><p style="color:var(--ink-soft); font-size:13.5px;">No recorded lectures have been uploaded for your classes yet.</p></div>`;
    }

    return `<div class="grid g3">
            ${videos.map(v => `
                <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:0; overflow:hidden;">
                    
                    <!-- Thumbnail Area -->
                    <div style="height:140px; background:linear-gradient(135deg, #15182A, #3457A6); display:flex; align-items:center; justify-content:center; color:#fff; font-size:40px; position:relative;">
                        ▶
                        <div style="position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.6); font-size:11px; padding:4px 8px; border-radius:4px;">
                            ${v.video_type}
                        </div>
                    </div>

                    <!-- Content Area -->
                    <div style="padding:16px; display:flex; flex-direction:column; flex:1;">
                        <h3 style="margin-top:0; margin-bottom:8px; font-size:16px;">${v.title}</h3>
                        ${v.description ? `<p style="font-size:12.5px; color:var(--ink); margin-bottom:12px; line-height:1.4; flex:1;">${v.description}</p>` : '<div style="flex:1;"></div>'}

                        <div style="font-size:11.5px; color:var(--ink-soft); margin-top:auto; margin-bottom:14px; padding-top:12px; border-top:1px solid var(--line);">
                            <strong>${v.subject_name}</strong> · ${v.teacher_name}<br>
                            <span style="display:inline-block; margin-top:4px;">📅 Uploaded: ${new Date(v.created_at).toLocaleDateString()}</span>
                        </div>

                        <a href="${v.video_url}" target="_blank" class="btn primary full-width" style="text-align:center; text-decoration:none; justify-content:center;">Watch Lecture</a>
                    </div>
                </div>
            `).join("")}
        </div>`;
  } catch (err) {
    return `<div class="card">Error loading lectures: ${err.message}</div>`;
  }
}
let testAttemptTimer = null;
let currentAttemptId = null;

async function launchTestAttempt(testId) {
  try {
    const res = await startTestAttempt(testId);
    const test = res.test;
    const questions = res.questions;
    currentAttemptId = res.attempt_id;

    document.documentElement.requestFullscreen().catch(e => console.log(e));

    document.getElementById("nav-group").style.display = "none";
    document.querySelector(".header").style.display = "none";
    document.getElementById("main-area").style.padding = "0";

    let timeRemaining = test.duration * 60;

    document.getElementById("content").innerHTML = `
        <div style="background:var(--surface); height:100vh; display:flex; flex-direction:column;">
            <div style="padding:20px; background:var(--bg); border-bottom:1px solid var(--line); display:flex; justify-content:space-between; align-items:center;">
                <h2>${test.title}</h2>
                <div style="font-size:24px; font-weight:bold; color:var(--bad);" id="test-timer">--:--</div>
                <button class="btn solid" onclick="finishTestAttempt()">Submit Paper</button>
            </div>
            <div style="padding:30px; overflow-y:auto; flex:1; max-width:900px; margin:0 auto; width:100%;">
                ${questions.map((q, i) => `
                    <div class="card" style="margin-bottom:20px;">
                        <h4>Q${i + 1}. ${q.question_text} <span style="float:right; color:var(--ink-soft); font-size:14px;">[${q.marks} Marks]</span></h4>
                        <div style="margin-top:15px;">
                            ${q.question_type === 'MCQ' ? `
                                <label style="display:block; margin-bottom:10px;"><input type="radio" name="q_${q.question_id}" value="A" onchange="autoSaveAnswer(${q.question_id}, null, 'A')"> A) ${q.option_a}</label>
                                <label style="display:block; margin-bottom:10px;"><input type="radio" name="q_${q.question_id}" value="B" onchange="autoSaveAnswer(${q.question_id}, null, 'B')"> B) ${q.option_b}</label>
                                <label style="display:block; margin-bottom:10px;"><input type="radio" name="q_${q.question_id}" value="C" onchange="autoSaveAnswer(${q.question_id}, null, 'C')"> C) ${q.option_c}</label>
                                <label style="display:block; margin-bottom:10px;"><input type="radio" name="q_${q.question_id}" value="D" onchange="autoSaveAnswer(${q.question_id}, null, 'D')"> D) ${q.option_d}</label>
                            ` : `
                                <textarea class="full-width" rows="${q.question_type === 'Long' ? 6 : 2}" placeholder="Type your answer here..." onblur="autoSaveAnswer(${q.question_id}, this.value, null)"></textarea>
                            `}
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>`;

    window.onbeforeunload = () => "Test is in progress. Refreshing may cause data loss.";

    testAttemptTimer = setInterval(() => {
      timeRemaining--;
      let m = Math.floor(timeRemaining / 60);
      let s = timeRemaining % 60;
      document.getElementById("test-timer").textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

      if (timeRemaining <= 0) {
        clearInterval(testAttemptTimer);
        finishTestAttempt();
      }
    }, 1000);

  } catch (err) {
    showToast(err.message);
  }
}

async function autoSaveAnswer(qId, text, option) {
  if (!currentAttemptId) return;
  try {
    await saveStudentAnswer(currentAttemptId, qId, text, option);
  } catch (e) {
    console.error("Auto-save failed", e);
  }
}

async function finishTestAttempt() {
  if (confirm("Are you sure you want to submit the test?")) {
    clearInterval(testAttemptTimer);
    window.onbeforeunload = null;
    try {
      await submitTestAttempt(currentAttemptId);
      if (document.fullscreenElement) document.exitFullscreen();

      document.getElementById("nav-group").style.display = "flex";
      document.querySelector(".header").style.display = "flex";
      document.getElementById("main-area").style.padding = "24px";

      showToast("Test Submitted Successfully");
      document.getElementById("content").innerHTML = await student_tests();
    } catch (err) {
      showToast(err.message);
    }
  }
}

// async function student_testresults() {
//     setTitle("Test Results", "Your scores and academic performance");

//     try {
//         const result = await loadTestResults();
//         const results = result.results;

//         return `
//         <div class="card">
//             <h3>Your Examinations</h3>
//             <table class="table" style="margin-top:15px;">
//                 <thead>
//                     <tr>
//                         <th>Test Title</th>
//                         <th>Subject</th>
//                         <th>Date</th>
//                         <th>Score</th>
//                         <th>Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${results.length === 0 ? `<tr><td colspan="5" style="text-align:center; color:var(--ink-soft);">No graded tests available.</td></tr>` :
//                     results.map(r => `
//                         <tr>
//                             <td><strong>${r.title}</strong></td>
//                             <td>${r.subject_name}</td>
//                             <td>${new Date(r.submitted_at).toLocaleDateString()}</td>
//                             <td><strong>${r.obtained_marks}/${r.total_marks}</strong> (${r.percentage}%)</td>
//                             <td>${pillFor('Graded')}</td>
//                         </tr>
//                     `).join("")}
//                 </tbody>
//             </table>
//         </div>
//         `;
//     } catch (err) {
//         return `<div class="card">Error loading results: ${err.message}</div>`;
//     }
// }
async function student_tests() {
  setTitle("Tests", "Available and attempted examinations");
  try {
    const result = await getStudentTests();
    const tests = result.tests;

    return `<div class="card">
            <h3>Your Examinations</h3>
            <table>
                <thead>
                    <tr>
                        <th>Test Title</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${tests.length === 0 ? `<tr><td colspan="5">No tests available</td></tr>` : tests.map(t => `
                        <tr>
                            <td><strong>${t.title}</strong><br><small>${t.duration} mins | ${t.total_marks} marks</small></td>
                            <td>${t.subject_name}</td>
                            <td class="mono">${new Date(t.test_date).toLocaleDateString()}</td>
                            <td>${pillFor(t.attempt_status || 'Pending')}</td>
                            <td>
                                ${!t.attempt_status ? `<button class="btn-sm solid" onclick="launchTestAttempt(${t.test_id})">Attempt Now</button>` :
        t.attempt_status === 'Submitted' ? `<span style="font-weight:bold;">${t.obtained_marks !== null ? t.obtained_marks + ' Marks' : 'Awaiting Result'}</span>` :
          `<button class="btn-sm warning" onclick="launchTestAttempt(${t.test_id})">Resume</button>`}
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>`;
  } catch (err) {
    return `<div class="card">Error loading tests: ${err.message}</div>`;
  }
}
async function student_results() {
  setTitle("Test Results", "Your scores, percentile and rank");

  try {
    const result = await loadTestResults(); // This calls your API
    const results = result.results; // Use the live data

    return `
        <div class="card">
            <table class="table">
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Score</th>
                        <th>Percentile</th>
                        <th>Rank</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.length === 0 ? `<tr><td colspan="4" style="text-align:center;">No results available.</td></tr>` :
        results.map(r => `
                        <tr>
                            <td><strong>${r.title}</strong></td>
                            <td class="mono">${r.obtained_marks}/${r.total_marks}</td>
                            <td class="mono">${Math.round(r.student_percentile)}th</td>
                            <td class="mono">#${r.student_rank}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>`;
  } catch (err) {
    return `<div class="card">Error loading results: ${err.message}</div>`;
  }
}
async function student_fees() {
    setTitle("Fees Status", "Track installments and dues");
    try {
        const result = await apiRequest("/fees"); // Your API call
        const feesData = result.data;
        const pct = feesData.total > 0 ? Math.round((feesData.paid / feesData.total) * 100) : 0;

        return `
            <div class="card" style="margin-bottom:18px;">
                <h3>₹${feesData.paid.toLocaleString()} paid of ₹${feesData.total.toLocaleString()}</h3>
                <div class="bar-bg" style="margin-top:10px;">
                    <div class="bar-fill good" style="width:${pct}%"></div>
                </div>
                <div style="font-size:12.5px; color:var(--ink-soft); margin-top:8px;">${pct}% of total fees cleared</div>
            </div>
            <div class="card">
                ${feesData.installments.map(f => `
                    <div class="ledger-row">
                        <div class="left"><strong>Installment</strong><span class="tag">Due ${new Date(f.due_date).toLocaleDateString()}</span></div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <span class="mono">₹${Number(f.amount).toLocaleString()}</span>
                            ${pillFor(f.status)}
                        </div>
                    </div>`).join("")}
            </div>`;
    } catch (err) {
        return `<div class="card">Error loading fees: ${err.message}</div>`;
    }
}
async function student_doubts() {
    setTitle("Ask Doubts", "Post a question, get help from your teacher");
    
    // Fetch human-to-human doubts
    const result = await apiRequest("/doubts");
    
    return `
        <div class="card" style="margin-bottom:18px;">
            <h3>Post a new doubt</h3>
            <textarea id="student-doubt-text" class="full-width" rows="4" placeholder="Type your question for the teacher here…"></textarea>
            <button class="btn primary" style="margin-top:10px;" onclick="postHumanDoubt()">Post Doubt</button>
        </div>
        <div class="card">
            <h3>Your doubts</h3>
            ${(!result.doubts || result.doubts.length === 0) ? '<p>No doubts posted yet.</p>' : result.doubts.map(d => `
                <div class="ledger-row" style="flex-direction:column; align-items:flex-start; margin-bottom:10px;">
                    <strong>${d.question}</strong>
                    <span class="pill ${d.status === 'Pending' ? 'bad' : 'good'}">${d.status}</span>
                    ${d.answer ? `<div style="margin-top:8px; font-size:13px;"><em>Teacher Answer:</em> ${d.answer}</div>` : ''}
                </div>
            `).join("")}
        </div>`;
}

async function postHumanDoubt() {
    const question = document.getElementById('student-doubt-text').value;
    
    // Send to the simple controller, NOT an AI endpoint
    const response = await fetch(`${API_URL}/doubts/ask`, { // Added 's' to doubt
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ question })
});

    const data = await response.json();
    if (data.success) {
        showToast("Doubt sent to teacher!");
        // Reload the UI to show the new doubt in the list
    } else {
        showToast("Error: " + data.message);
    }
}




async function submitDoubt() {
    const question = document.getElementById('student-question').value;
    const responseArea = document.getElementById('ai-response-area');
    
    responseArea.innerText = "Aryavart AI is thinking...";

    try {
        const response = await fetch(`${API_URL}/doubt/ask`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Ensure you have the token saved here
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        
        if (data.success) {
            responseArea.innerText = "AI Answer: " + data.answer;
        } else {
            responseArea.innerText = "Error: " + data.message;
        }
    } catch (err) {
        responseArea.innerText = "Failed to connect to AI Engine.";
    }
}
async function askAI() {
    const inputField = document.getElementById('ai-chat-input');
    const responseBox = document.getElementById('ai-response-box');
    const responseText = document.getElementById('ai-response-text');

    if (!inputField || !responseBox || !responseText) {
        console.error("UI Elements NOT found!");
        console.log("Input:", inputField, "Box:", responseBox, "Text:", responseText);
        showToast("Error: UI components not loaded.");
        return;
    }

    const question = inputField.value;
    if (!question.trim()) return showToast("Enter a question!");

    responseBox.style.display = 'block';
    responseText.innerText = "Searching...";

    try {
        const response = await fetch(`${API_URL}/doubts/ai-ask`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        responseText.innerText = data.success ? data.answer : "Error: " + data.message;
    } catch (err) {
        responseText.innerText = "Connection error: " + err.message;
    }
}
async function student_aichat() {
    setTitle("AI Chat", "Aryavart AI Assistant");
    
    return `
        <div class="card">
            <h3>Aryavart AI Assistant</h3>
            <textarea id="ai-chat-input" class="full-width" rows="4" placeholder="Ask AI about your syllabus..."></textarea>
            <button class="btn primary" style="margin-top:10px;" onclick="askAI()">Ask AI</button>
            
            <div id="ai-response-box" style="margin-top:20px; display:none; padding:15px; background:var(--bg); border-radius:8px;">
                <strong>AI Response:</strong>
                <p id="ai-response-text"></p>
            </div>
        </div>
    `;
}



/* ---- PARENT ---- */
async function parent_dashboard() {
    setTitle("Dashboard", "Track your child's progress");
    
    try {
        const result = await apiRequest("/parent/dashboard");
        const { studentName, stats } = result.data;

        return `
            <div class="card" style="margin-bottom:20px;">
                <h2>Welcome, Parent</h2>
                <p>Tracking progress for: <strong>${studentName}</strong></p>
            </div>
            <div class="grid g4" style="margin-bottom:18px;">
                <div class="card stat-card"><div class="lbl">Avg Test Score</div><div class="val">${stats.avg_test || 0}%</div></div>
                <div class="card stat-card"><div class="lbl">Pending Homework</div><div class="val">${stats.pending_hw}</div></div>
                <div class="card stat-card"><div class="lbl">Attendance</div><div class="val">94%</div></div>
                <div class="card stat-card"><div class="lbl">Fees Status</div><div class="val">Paid</div></div>
            </div>
        `;
    } catch (err) {
        return `<div class="card">Error loading dashboard: ${err.message}</div>`;
    }
}
async function parent_liveattendance() {
    setTitle("Live Attendance", "Real-time presence today");

    try {
        const response = await fetch(`${API_URL}/parent/live-attendance`, {
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Server responded with " + response.status);

        const result = await response.json();
        const { latest, history } = result.data; // Accessing the object structure[cite: 2]

        // Build Latest Check-in card
        const latestHtml = latest ? `
            <div class="card" style="margin-bottom:18px; display:flex; align-items:center; gap:16px;">
                <div style="width:54px; height:54px; border-radius:50%; background:var(--good-bg); color:var(--good); display:flex; align-items:center; justify-content:center; font-size:22px;">✓</div>
                <div>
                    <strong style="font-size:16px;">Status: ${latest.status}</strong>
                    <div style="font-size:12.5px; color:var(--ink-soft);">${latest.attendance_date}</div>
                </div>
            </div>` : `<div class="card">No attendance recorded today.</div>`;

        // Build History list
        const historyHtml = history.map(a => `
            <div class="ledger-row">
                <span>${a.date}</span>
                ${pillFor(a.status)}
            </div>`).join("");

        return `${latestHtml}
        <div class="card">
            <h3>This week</h3>
            ${historyHtml}
        </div>`;
    } catch (err) {
        console.error("Error loading attendance:", err);
        return `<div class="card">Error: ${err.message}</div>`;
    }
}
async function parent_fees() {
    setTitle("Fees Status", "Track installments and dues");
    try {
        // Use the new parent-specific fees endpoint
        const result = await apiRequest("/parent/fees"); 
        const feesData = result.data;

        return `
            <div class="card">
                <h3>Fee Ledger</h3>
                ${feesData.map(f => `
                    <div class="ledger-row">
                        <div class="left"><strong>Due Date: ${new Date(f.due_date).toLocaleDateString()}</strong></div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <span class="mono">₹${Number(f.amount).toLocaleString("en-IN")}</span>
                            ${pillFor(f.status)}
                        </div>
                    </div>`).join("")}
            </div>`;
    } catch (err) {
        return `<div class="card">Error loading fees: ${err.message}</div>`;
    }
}
async function parent_performance() {
    setTitle("Performance", "Trend across recent tests");

    try {
        const response = await fetch(`${API_URL}/parent/performance`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const result = await response.json();
        const results = result.data; // This replaces the missing 'resultsData'

        return `
            <div class="card" style="margin-bottom:18px;">
                <h3>Score trend</h3>
                <div style="display:flex; align-items:flex-end; gap:16px; height:160px; padding-top:10px;">
                    ${results.map((r, i) => `
                        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px;">
                            <div style="width:100%; background:var(--accent); border-radius:6px 6px 0 0; height:${r.score}px;"></div>
                            <span style="font-size:11px; color:var(--ink-soft);">T${i + 1}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
            <div class="card">
                <table class="table">
                    <thead><tr><th>Test Name</th><th>Score</th></tr></thead>
                    <tbody>
                        ${results.map(r => `<tr><td><strong>${r.name}</strong></td><td class="mono">${r.score}%</td></tr>`).join("")}
                    </tbody>
                </table>
            </div>`;
    } catch (err) {
        return `<div class="card">Error loading performance: ${err.message}</div>`;
    }
};
async function parent_homeworkstatus() {
    setTitle("Homework Status", "What's pending vs completed");
    
    try {
        const response = await fetch(`${API_URL}/parent/homework-status`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const result = await response.json();
        
        return `
            <div class="card">
                <h3>Assignments</h3>
                ${result.data.map(h => `
                    <div class="ledger-row">
                        <div><strong>${h.title}</strong><br><small>Due: ${h.due_date}</small></div>
                        ${pillFor(h.submission_status || "Pending")}
                    </div>
                `).join("")}
            </div>`;
    } catch (err) {
        return `<div class="card">Error loading homework: ${err.message}</div>`;
    }
};
async function parent_remarks() {
    setTitle("Teacher Remarks", "Faculty notes on your child");

    try {
        const response = await fetch(`${API_URL}/parent/remarks`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const result = await response.json();
        const remarks = result.data || [];

        if (remarks.length === 0) {
            return `<div class="card">No teacher remarks available yet.</div>`;
        }

        return `<div class="card">
            ${remarks.map(r => `
                <div class="ledger-row" style="align-items:flex-start;">
                    <div class="left" style="flex-direction:column; align-items:flex-start; gap:4px;">
                        <strong>${r.teacher}</strong>
                        <span style="font-size:13px; color:var(--ink-soft); max-width:480px;">${r.note}</span>
                    </div>
                    <span class="tag">${new Date(r.date).toLocaleDateString()}</span>
                </div>
            `).join("")}
        </div>`;
    } catch (err) {
        return `<div class="card">Error loading remarks: ${err.message}</div>`;
    }
}
async function parent_monthly() {
    setTitle("Monthly Report", new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) + " summary");

    try {
        const response = await fetch(`${API_URL}/parent/monthly-report`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        
        const result = await response.json();
        console.log("API Result Data:", result);

        // 2. Safely check for success
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Server returned an error");
        }
        
        const d = result.data;

        // 3. Render only if data exists
        return `
            <div class="grid g3" style="margin-bottom:18px;">
                <div class="card stat-card"><div class="lbl">Avg attendance</div><div class="val">${d.attendance || 0}%</div></div>
                <div class="card stat-card"><div class="lbl">Avg test score</div><div class="val">${d.testScore || 0}%</div></div>
                <div class="card stat-card"><div class="lbl">Homework completed</div><div class="val">${d.homework || 0}</div></div>
            </div>
            <div class="card">
                <h3>Faculty summary</h3>
                <p style="font-size:13.5px; line-height:1.7;">${d.summary || "No summary available."}</p>
                <button class="btn-sm solid" style="margin-top:14px;" onclick="showToast('Downloading report PDF…')">Download full report</button>
            </div>`;
    } catch (err) {
        console.error("Frontend Monthly Report Error:", err);
        return `<div class="card">Error loading report: ${err.message}</div>`;
    }
}

async function parent_exams() {
    setTitle("Upcoming Exams", "What's scheduled next");

    try {
        const response = await fetch(`${API_URL}/parent/upcoming-exams`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const result = await response.json();
        const tests = result.data || [];

        if (tests.length === 0) {
            return `<div class="card">No upcoming exams scheduled.</div>`;
        }

        return `<div class="card">
            ${tests.map(t => `
                <div class="ledger-row">
                    <div class="left">
                        <strong>${t.title}</strong>
                        <span class="tag">${t.syllabus}</span>
                    </div>
                    <span class="mono">${new Date(t.date).toLocaleDateString()}</span>
                </div>
            `).join("")}
        </div>`;
    } catch (err) {
        return `<div class="card">Error loading exams: ${err.message}</div>`;
    }
}
async function parent_notice() {
    setTitle("Notice Board", "Updates from the academy");

    try {
        const response = await fetch(`${API_URL}/parent/notices`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const result = await response.json();
        const notices = result.data || [];

        if (notices.length === 0) {
            return `<div class="card">No notices available.</div>`;
        }

        return `<div class="grid g2">
            ${notices.map(n => `
                <div class="card">
                    <strong>${n.title}</strong>
                    <p style="font-size:13px; color:var(--ink-soft); margin-top:8px;">${n.body}</p>
                    <div style="font-size:11.5px; color:var(--ink-soft); margin-top:10px;">
                        ${new Date(n.date).toLocaleDateString()}
                    </div>
                </div>
            `).join("")}
        </div>`;
    } catch (err) {
        return `<div class="card">Error loading notices: ${err.message}</div>`;
    }
}
async function parent_chat() {
    setTitle("Chat with Teachers", "Your active conversations");
    
    try {
        const response = await fetch(`${API_URL}/parent/chat`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const result = await response.json();
        
        // Ensure result.messages exists
        const messages = result.messages || [];
        
        return `
            <div class="card" style="height:60vh; display:flex; flex-direction:column;">
                <div id="chat-box" style="flex:1; overflow-y:auto; padding:15px; display:flex; flex-direction:column; gap:10px;">
    ${messages.length === 0 ? '<p>No messages yet.</p>' : messages.map(m => `
        <div style="align-self: ${m.sender_id === result.currentUserId ? 'flex-end' : 'flex-start'}; 
                    padding: 10px; border-radius: 8px; background: ${m.sender_id === result.currentUserId ? 'var(--primary)' : 'var(--bg)'};
                    color: ${m.sender_id === result.currentUserId ? '#fff' : 'var(--ink)'};">
            ${m.content}
            <div style="font-size:10px; opacity:0.7;">${new Date(m.sent_at).toLocaleTimeString()}</div>
        </div>
    `).join("")}
</div>
            </div>`;
    } catch (err) {
        return `<div class="card">Error loading chat: ${err.message}</div>`;
    }
}

/* ---- TEACHER ---- */
async function teacher_dashboard() {

  setTitle("Dashboard", "Your classes and pending actions");

  const result = await loadTeacherDashboard();

  const data = result.dashboard;

  return `
    <div class="grid g4" style="margin-bottom:18px;">

        <div class="card stat-card">
            <div class="lbl">Classes Today</div>
            <div class="val">${data.todayClasses}</div>
        </div>

        <div class="card stat-card">
            <div class="lbl">Homework Pending</div>
            <div class="val">${data.pendingHomework}</div>
        </div>

        <div class="card stat-card">
            <div class="lbl">Pending Doubts</div>
            <div class="val">${data.pendingDoubts}</div>
        </div>

        <div class="card stat-card">
            <div class="lbl">Attendance</div>
            <div class="val">${data.attendance}%</div>
        </div>

    </div>

    <div class="card">

        <h3>Today's Classes</h3>

        ${data.classes.map(c => `
    <div class="ledger-row">

        <div>

            <strong>${c.subject_name}</strong><br>

            ${c.batch_name}

            <div style="font-size:12px;color:gray;">
                ${c.start_time} - ${c.end_time}
            </div>

        </div>

        <button
            class="btn primary"
            onclick="openAttendance(${c.timetable_id})"
        >
            Take Attendance
        </button>

    </div>
`).join("")}

    </div>
    `;
}

async function loadAttendanceStudents(timetableId) {

  return await apiRequest(
    `/attendance/class/${timetableId}`
  );

};

async function openAttendance(timetableId) {

  const result = await loadAttendanceStudents(timetableId);

  const students = result.students;

  setTitle("Mark Attendance", "Mark today's attendance");

  document.getElementById("content").innerHTML = `

        <div class="card">

            <h2>Student Attendance</h2>

            <table class="table">

                <thead>

                    <tr>

                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    ${students.map(s => `

                        <tr>

                            <td>${s.roll_no}</td>

                            <td>${s.full_name}</td>

                            <td>

                                <select id="status-${s.student_id}">

                                    <option value="Present">Present</option>

                                    <option value="Absent">Absent</option>

                                    <option value="Late">Late</option>

                                </select>

                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

            <br>

            <button
                class="btn primary"
                onclick="saveAttendance(${timetableId})"
            >
                Save Attendance
            </button>

        </div>

    `;

}


async function saveAttendance(timetableId) {

  const rows = document.querySelectorAll("tbody tr");

  const students = [];

  rows.forEach(row => {

    const select = row.querySelector("select");

    const studentId = Number(
      select.id.replace("status-", "")
    );

    students.push({

      student_id: studentId,

      status: select.value

    });

  });

  const attendanceData = {

    timetable_id: timetableId,

    attendance_date: new Date().toISOString().split("T")[0],

    students

  };

  try {

    const result = await apiRequest(

      "/attendance",

      "POST",

      attendanceData

    );

    showToast(result.message);

  }

  catch (err) {

    showToast(err.message);

  }

}

async function teacher_markattendance() {

  setTitle(
    "Mark Attendance",
    "Select a class from today's schedule"
  );

  const result = await loadTeacherDashboard();

  const data = result.dashboard;

  return `

    <div class="card">

        <h3>Today's Classes</h3>

        ${data.classes.map(c => `

            <div class="ledger-row">

                <div>

                    <strong>${c.subject_name}</strong><br>

                    ${c.batch_name}<br>

                    ${c.start_time} - ${c.end_time}

                </div>

                <button
                    class="btn primary"
                    onclick="openAttendance(${c.timetable_id})"
                >
                    Take Attendance
                </button>

            </div>

        `).join("")}

    </div>

    `;

}
async function teacher_uploadhomework() {

  setTitle(
    "Upload Homework",
    "Create homework for your students"
  );

  const result = await loadHomeworkOptions();

  const assignments = result.assignments;

  return `

    <div class="card">

        <div class="form-grid">

            <div>

                <label>Class</label>

                <select id="hw-assignment">

                    ${assignments.map(a => `

                        <option value="${a.teacher_subject_id}">

                            ${a.subject_name} - ${a.batch_name}

                        </option>

                    `).join("")}

                </select>

            </div>

            <div>

                <label>Due Date</label>

                <input
                    type="date"
                    id="hw-date"
                >

            </div>

        </div>

        <br>

        <label>Homework Title</label>

        <input
            id="hw-title"
            type="text"
            placeholder="Homework Title"
        >

        <br><br>

        <label>Description</label>

        <textarea
            id="hw-description"
            rows="6"
            placeholder="Enter Homework..."
        ></textarea>

        <br><br>

        <button
            class="btn primary"
            onclick="saveHomework()"
        >
            Upload Homework
        </button>

    </div>

    `;

}
// async function teacher_uploadnotes() {
//   setTitle("Upload Notes", "Share daily notes with a batch");
//   return uploadForm("notes", "e.g. Rotational Motion — Summary Notes");
// };
// async function teacher_uploadvideos() {

//   setTitle(
//     "Upload Videos",
//     "Publish recorded lectures"
//   );

//   const optionResult = await loadVideoOptions();

//   const assignments = optionResult.assignments;

//   const result = await loadTeacherVideos();

//   const videos = result.videos;

//   return `

// <div class="grid g2">

//     <div class="card">

//         <h3>📺 Upload Video</h3>

//         <label>Subject / Batch</label>

//         <select id="video-assignment">

//             ${assignments.map(a => `

//             <option value="${a.teacher_subject_id}">

//                 ${a.subject_name} - ${a.batch_name}

//             </option>

//             `).join("")}

//         </select>

//         <br><br>

//         <label>Title</label>

//         <input
//             id="video-title"
//             class="full-width"
//             placeholder="Rotational Motion Part-3"
//         >

//         <br><br>

//         <label>Description</label>

//         <textarea

//             id="video-description"

//             class="full-width"

//             rows="5"

//             placeholder="Lecture description..."

//         ></textarea>

//         <br><br>

//         <label>Video Type</label>

//         <select id="video-type">

//             <option value="YouTube">

//                 YouTube

//             </option>

//             <option value="Drive">

//                 Google Drive

//             </option>

//         </select>

//         <br><br>

//         <label>Video URL</label>

//         <input

//             id="video-url"

//             class="full-width"

//             placeholder="Paste YouTube or Drive link"

//         >

//         <br><br>

//         <button

//             class="btn primary"

//             onclick="saveVideo()"

//         >

//             📤 Upload Video

//         </button>

//     </div>

//     <div class="card">

//         <h3>

//             📺 Uploaded Videos (${videos.length})

//         </h3>

//         <input

//             id="search-video"

//             class="full-width"

//             placeholder="🔍 Search Videos"

//             onkeyup="filterVideos()"

//         >

//         <br><br>

//         ${videos.length === 0 ?

//       `<p>No videos uploaded.</p>`

//       :

//       videos.map(video => `

//         <div

//             class="ledger-row video-card"

//             data-title="${video.title.toLowerCase()}"

//             data-subject="${video.subject_name.toLowerCase()}"

//         >

//             <div>

//                 <strong>

//                     ${video.title}

//                 </strong>

//                 <br>

//                 ${video.subject_name}

//                 -

//                 ${video.batch_name}

//                 <br>

//                 <small>

//                     ${video.video_type}

//                 </small>

//             </div>

//             <div style="display:flex;gap:8px;">

//                 <a

//                     href="${video.video_url}"

//                     target="_blank"

//                     class="btn secondary"

//                 >

//                     ▶ Watch

//                 </a>

//                 <button

//                     class="btn warning"

//                     onclick="editVideo(${video.video_id})"

//                 >

//                     ✏ Edit

//                 </button>

//                 <button

//                     class="btn danger"

//                     onclick="removeVideo(${video.video_id})"

//                 >

//                     🗑 Delete

//                 </button>

//             </div>

//         </div>

//         `).join("")

//     }

//     </div>

// </div>

// `;

// }

async function saveVideo() {

  try {

    const data = {

      teacher_subject_id:
        document.getElementById("video-assignment").value,

      title:
        document.getElementById("video-title").value.trim(),

      description:
        document.getElementById("video-description").value.trim(),

      video_type:
        document.getElementById("video-type").value,

      video_url:
        formatVideoUrl(
          document.getElementById("video-url").value.trim(),
          document.getElementById("video-type").value
        )

    };

    if (!data.title || !data.video_url) {

      showToast("Please fill all required fields");

      return;

    }

    const result = await uploadVideo(data);

    showToast(result.message);

    await renderSection();

  }

  catch (err) {

    showToast(err.message);

  }

}

async function removeVideo(videoId) {

  if (!confirm("Delete this video?")) {

    return;

  }

  try {

    const result = await deleteVideo(videoId);

    showToast(result.message);

    await renderSection();

  }

  catch (err) {

    showToast(err.message);

  }

}

async function editVideo(videoId) {

  try {

    const result = await getVideo(videoId);

    const video = result.video;

    const title = prompt("Video Title", video.title);

    if (title === null) return;

    const description = prompt(

      "Description",

      video.description || ""

    );

    if (description === null) return;

    const url = prompt(

      "Video URL",

      video.video_url

    );

    if (url === null) return;

    await updateVideo(

      videoId,

      {

        teacher_subject_id:

          video.teacher_subject_id,

        title,

        description,

        video_type:

          video.video_type,

        video_url:

          formatVideoUrl(

            url,

            video.video_type

          )

      }

    );

    showToast(

      "Video Updated"

    );

    await renderSection();

  }

  catch (err) {

    showToast(err.message);

  }

}

function filterVideos() {

  const search = document
    .getElementById("search-video")
    .value
    .toLowerCase();

  document
    .querySelectorAll(".video-card")
    .forEach(card => {

      const title = card.dataset.title;

      const subject = card.dataset.subject;

      if (

        title.includes(search)

        ||

        subject.includes(search)

      ) {

        card.style.display = "flex";

      }

      else {

        card.style.display = "none";

      }

    });

}

function formatVideoUrl(url, type) {

  if (type === "YouTube") {

    if (url.includes("watch?v=")) {

      return url.replace(

        "watch?v=",

        "embed/"

      );

    }

    if (url.includes("youtu.be/")) {

      const id = url.split("youtu.be/")[1];

      return `https://www.youtube.com/embed/${id}`;

    }

  }

  if (type === "Drive") {

    if (

      url.includes("/file/d/")

    ) {

      const id = url

        .split("/file/d/")[1]

        .split("/")[0];

      return `https://drive.google.com/file/d/${id}/preview`;

    }

  }

  return url;

}
let currentTestBuilderId = null;
let currentTestQuestions = [];

async function teacher_generatetests() {
  setTitle("Generate Tests", "Create and manage examinations");
  const optionsResult = await loadTestOptions();
  const assignments = optionsResult.assignments;
  const testsResult = await loadTeacherTests();
  const tests = testsResult.tests;

  return `
    <div class="grid g2">
        <div class="card" id="test-builder-card">
            <h3>📝 Create / Edit Test</h3>
            <input type="hidden" id="builder-test-id">
            
            <div class="form-grid">
                <div>
                    <label>Batch / Subject</label>
                    <select id="builder-assignment" class="input-like full-width">
                        ${assignments.map(a => `<option value="${a.teacher_subject_id}">${a.batch_name} - ${a.subject_name}</option>`).join("")}
                    </select>
                </div>
                <div>
                    <label>Test Date</label>
                    <input type="date" id="builder-date" class="full-width">
                </div>
            </div>
            
            <label>Test Title</label>
            <input type="text" id="builder-title" class="full-width" placeholder="Unit Test 1">
            
            <label>Description</label>
            <textarea id="builder-desc" class="full-width" rows="2" placeholder="Syllabus covered..."></textarea>
            
            <div class="form-grid">
                <div>
                    <label>Duration (Mins)</label>
                    <input type="number" id="builder-duration" class="full-width" placeholder="60">
                </div>
                <div>
                    <label>Total Marks</label>
                    <input type="number" id="builder-marks" class="full-width" placeholder="100">
                </div>
            </div>

            <div style="margin-top: 15px; padding: 15px; border: 1.5px solid var(--line); border-radius: 8px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
                    <h4 style="margin:0;">Question Builder</h4>
                    <button class="btn-sm solid" onclick="addQuestionUI()">+ Add Question</button>
                </div>
                <div id="questions-container" style="display:flex; flex-direction:column; gap:15px; max-height:400px; overflow-y:auto; padding-right:10px;">
                    <p style="color:var(--ink-soft); font-size:13px; text-align:center;">Click '+ Add Question' to start building the paper.</p>
                </div>
            </div>

            <div style="margin-top:20px; display:flex; gap:10px;">
                <button class="btn primary" onclick="saveTestDraft()">Save Draft</button>
                <button class="btn good" onclick="publishTestUI()">Publish Test</button>
                <button class="btn secondary" onclick="teacher_generatetests().then(h => document.getElementById('content').innerHTML = h)">Clear</button>
            </div>
        </div>

        <div class="card">
            <h3>📚 Existing Tests (${tests.length})</h3>
            <input type="text" id="search-tests" class="full-width" placeholder="🔍 Search..." onkeyup="filterTestsList()">
            <div style="margin-top:15px; display:flex; flex-direction:column; gap:10px;" id="tests-list">
                ${tests.length === 0 ? `<p>No tests created yet.</p>` : tests.map(t => `
                    <div class="ledger-row test-item-row" data-search="${t.title.toLowerCase()} ${t.batch_name.toLowerCase()}">
                        <div>
                            <strong>${t.title}</strong><br>
                            <span style="font-size:12px; color:var(--ink-soft);">${t.batch_name} - ${t.subject_name} | ${t.questions} Qs | ${t.duration}m</span><br>
                            ${t.status === 'Published' ? `<span style="color:var(--good); font-size:12px; font-weight:600;">Published</span>` : `<span style="color:var(--accent); font-size:12px; font-weight:600;">Draft</span>`}
                        </div>
                        <div style="display:flex; gap:6px;">
                            <button class="btn-sm warning" onclick="editTestUI(${t.test_id})">✏ Edit</button>
                            <button class="btn-sm danger" onclick="deleteTestUI(${t.test_id})">🗑 Delete</button>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    </div>`;
}

function addQuestionUI(qData = null) {
  const container = document.getElementById("questions-container");
  if (container.querySelector("p")) container.innerHTML = "";

  const qIndex = currentTestQuestions.length;
  const qObj = qData || {
    question_id: null, question_text: "", question_type: "MCQ",
    option_a: "", option_b: "", option_c: "", option_d: "",
    correct_option: "A", marks: 1, question_order: qIndex + 1
  };
  currentTestQuestions.push(qObj);
  renderQuestionsList();
}

function renderQuestionsList() {
  const container = document.getElementById("questions-container");
  container.innerHTML = currentTestQuestions.map((q, idx) => `
        <div class="card" style="padding:10px; background:var(--bg); border: 1px solid var(--line);" data-idx="${idx}">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <strong>Q${idx + 1}</strong>
                <div>
                    <button class="btn-sm danger" style="padding:2px 6px; font-size:11px;" onclick="removeQuestionUI(${idx})">Remove</button>
                </div>
            </div>
            <textarea class="full-width" placeholder="Question Text" onchange="updateQField(${idx}, 'question_text', this.value)" style="margin-bottom:8px;" rows="2">${q.question_text}</textarea>
            <div class="form-grid" style="margin-bottom:8px;">
                <select class="input-like" onchange="updateQType(${idx}, this.value)">
                    <option value="MCQ" ${q.question_type === 'MCQ' ? 'selected' : ''}>Multiple Choice</option>
                    <option value="Short" ${q.question_type === 'Short' ? 'selected' : ''}>Short Answer</option>
                    <option value="Long" ${q.question_type === 'Long' ? 'selected' : ''}>Long Answer</option>
                </select>
                <input type="number" placeholder="Marks" value="${q.marks}" onchange="updateQField(${idx}, 'marks', this.value)">
            </div>
            <div id="opts-${idx}" style="display: ${q.question_type === 'MCQ' ? 'block' : 'none'};">
                <input type="text" class="full-width" style="margin-bottom:4px;" placeholder="Option A" value="${q.option_a}" onchange="updateQField(${idx}, 'option_a', this.value)">
                <input type="text" class="full-width" style="margin-bottom:4px;" placeholder="Option B" value="${q.option_b}" onchange="updateQField(${idx}, 'option_b', this.value)">
                <input type="text" class="full-width" style="margin-bottom:4px;" placeholder="Option C" value="${q.option_c}" onchange="updateQField(${idx}, 'option_c', this.value)">
                <input type="text" class="full-width" style="margin-bottom:4px;" placeholder="Option D" value="${q.option_d}" onchange="updateQField(${idx}, 'option_d', this.value)">
                <select class="input-like full-width" onchange="updateQField(${idx}, 'correct_option', this.value)">
                    <option value="A" ${q.correct_option === 'A' ? 'selected' : ''}>Correct: A</option>
                    <option value="B" ${q.correct_option === 'B' ? 'selected' : ''}>Correct: B</option>
                    <option value="C" ${q.correct_option === 'C' ? 'selected' : ''}>Correct: C</option>
                    <option value="D" ${q.correct_option === 'D' ? 'selected' : ''}>Correct: D</option>
                </select>
            </div>
        </div>
    `).join("");
}

function updateQType(idx, val) {
  currentTestQuestions[idx].question_type = val;
  document.getElementById(`opts-${idx}`).style.display = val === 'MCQ' ? 'block' : 'none';
}
function updateQField(idx, field, val) {
  currentTestQuestions[idx][field] = val;
}
function removeQuestionUI(idx) {
  currentTestQuestions.splice(idx, 1);
  renderQuestionsList();
}

async function saveTestDraft() {
  const data = {
    teacher_subject_id: document.getElementById("builder-assignment").value,
    title: document.getElementById("builder-title").value,
    description: document.getElementById("builder-desc").value,
    duration: document.getElementById("builder-duration").value,
    total_marks: document.getElementById("builder-marks").value,
    test_date: document.getElementById("builder-date").value,
    status: "Draft"
  };

  if (!data.title || !data.duration || !data.total_marks) return showToast("Fill required fields");

  try {
    let testId = document.getElementById("builder-test-id").value;
    if (testId) {
      await updateTest(testId, data);
    } else {
      const res = await createTest(data);
      testId = res.test_id;
    }

    for (let i = 0; i < currentTestQuestions.length; i++) {
      let q = currentTestQuestions[i];
      q.test_id = testId;
      q.question_order = i + 1;
      if (q.question_id) {
        await updateQuestion(q.question_id, q);
      } else {
        await addQuestion(q);
      }
    }
    showToast("Test saved successfully!");
    document.getElementById("content").innerHTML = await teacher_generatetests();
  } catch (err) {
    showToast(err.message);
  }
}

async function editTestUI(testId) {
  const res = await getTest(testId);
  document.getElementById("builder-test-id").value = res.test.test_id;
  document.getElementById("builder-assignment").value = res.test.teacher_subject_id;
  document.getElementById("builder-title").value = res.test.title;
  document.getElementById("builder-desc").value = res.test.description;
  document.getElementById("builder-duration").value = res.test.duration;
  document.getElementById("builder-marks").value = res.test.total_marks;
  document.getElementById("builder-date").value = res.test.test_date.split('T')[0];
  currentTestQuestions = res.questions;
  renderQuestionsList();
}

async function deleteTestUI(testId) {
  if (confirm("Delete this entire test?")) {
    await deleteTest(testId);
    document.getElementById("content").innerHTML = await teacher_generatetests();
  }
}

async function publishTestUI() {
  let testId = document.getElementById("builder-test-id").value;
  if (!testId) return showToast("Save the draft first before publishing.");
  if (confirm("Publishing makes it visible to students. Continue?")) {
    await publishTest(testId);
    showToast("Test Published!");
    document.getElementById("content").innerHTML = await teacher_generatetests();
  }
}

function filterTestsList() {
  const term = document.getElementById("search-tests").value.toLowerCase();
  document.querySelectorAll(".test-item-row").forEach(row => {
    row.style.display = row.dataset.search.includes(term) ? "flex" : "none";
  });
}
async function teacher_checkhomework() {
  setTitle("Check Homework", "Review and grade submissions");
  try {
    const result = await getTeacherHomeworkCheckList();
    const hwList = result.homework;

    return `
        <div class="grid g3" style="margin-bottom: 20px;">
            <div class="card stat-card"><div class="lbl">Active Assignments</div><div class="val">${hwList.length}</div></div>
            <div class="card stat-card"><div class="lbl">Total Submissions</div><div class="val">${hwList.reduce((acc, curr) => acc + curr.submitted_count, 0)}</div></div>
            <div class="card stat-card"><div class="lbl">Needs Grading</div><div class="val accent">Action Req.</div></div>
        </div>

        <div class="card" id="hw-teacher-main">
            <h3>Homework Assignments</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Title / Subject</th>
                        <th>Batch</th>
                        <th>Submissions</th>
                        <th>Due Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${hwList.map(h => {
      const pct = h.total_students > 0 ? Math.round((h.submitted_count / h.total_students) * 100) : 0;
      return `
                        <tr>
                            <td><strong>${h.title}</strong><br><small style="color:var(--ink-soft);">${h.subject_name}</small></td>
                            <td>${h.batch_name}</td>
                            <td>
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <span class="mono">${h.submitted_count}/${h.total_students}</span>
                                    <div class="bar-bg" style="width:60px;"><div class="bar-fill good" style="width:${pct}%"></div></div>
                                </div>
                                ${h.late_count > 0 ? `<small style="color:var(--accent);">${h.late_count} Late</small>` : ''}
                            </td>
                            <td class="mono">${new Date(h.due_date).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-sm primary" onclick="loadHomeworkGradingUI(${h.homework_id}, '${h.title}')">View Submissions</button>
                            </td>
                        </tr>
                        `;
    }).join("")}
                </tbody>
            </table>
        </div>
        `;
  } catch (err) {
    return `<div class="card">Error loading data: ${err.message}</div>`;
  }
}

let currentGradingList = [];

async function loadHomeworkGradingUI(hwId, hwTitle) {
  try {
    const result = await getSubmissionsForHomework(hwId);
    currentGradingList = result.submissions;

    const mainCard = document.getElementById("hw-teacher-main");

    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3>Submissions for: ${hwTitle}</h3>
            <div>
                <button class="btn-sm secondary" onclick="teacher_checkhomework().then(h => document.getElementById('content').innerHTML = h)">⬅ Back to List</button>
                <button class="btn-sm primary" onclick="showToast('Bulk Download started...')">Bulk Download</button>
            </div>
        </div>
        
        <div style="margin-bottom:15px; display:flex; gap:10px;">
            <input type="text" id="hw-search-student" class="input-like" placeholder="🔍 Search Student..." onkeyup="filterGradingTable()" style="flex:1;">
            <select id="hw-filter-status" class="input-like" onchange="filterGradingTable()">
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="SUBMITTED">Submitted / Late</option>
                <option value="CHECKED">Checked / Approved</option>
            </select>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Roll / Name</th>
                    <th>Status</th>
                    <th>File & Date</th>
                    <th>Grading Action</th>
                </tr>
            </thead>
            <tbody id="hw-grading-tbody">
                ${renderGradingRows(currentGradingList)}
            </tbody>
        </table>
        `;
    mainCard.innerHTML = html;
  } catch (err) {
    showToast(err.message);
  }
}

function renderGradingRows(list) {
  return list.map(s => {
    const isPending = !s.status;
    const fileLink = s.file_path ? `${API_URL.replace('/api', '')}${s.file_path}` : null;

    return `
        <tr class="hw-grade-row" data-name="${s.full_name.toLowerCase()}" data-status="${isPending ? 'PENDING' : s.status === 'Checked' || s.status === 'Approved' ? 'CHECKED' : 'SUBMITTED'}">
            <td><strong>${s.full_name}</strong><br><small>Roll: ${s.roll_no}</small></td>
            <td>${pillFor(s.status || "Pending")}</td>
            <td>
                ${isPending ? `<span style="color:var(--ink-soft);">No file</span>` :
        `<div><a href="${fileLink}" target="_blank" class="btn-sm secondary">Open File</a></div>
                 <small style="color:var(--ink-soft);">${new Date(s.submitted_at).toLocaleDateString()}</small>`}
            </td>
            <td>
                ${isPending ? `-` : `
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <div style="display:flex; gap:6px;">
                        <input type="number" id="marks_${s.submission_id}" placeholder="Marks" value="${s.teacher_marks || ''}" style="width:70px; padding:4px;">
                        <select id="status_${s.submission_id}" style="padding:4px;">
                            <option value="Checked" ${s.status === 'Checked' ? 'selected' : ''}>Approve/Check</option>
                            <option value="Rejected" ${s.status === 'Rejected' ? 'selected' : ''}>Reject</option>
                        </select>
                    </div>
                    <div style="display:flex; gap:6px;">
                        <input type="text" id="feedback_${s.submission_id}" placeholder="Feedback note..." value="${s.teacher_feedback || ''}" style="flex:1; padding:4px;">
                        <button class="btn-sm solid" onclick="saveHomeworkGrade(${s.submission_id})">Save</button>
                    </div>
                </div>`}
            </td>
        </tr>`;
  }).join("");
}

function filterGradingTable() {
  const search = document.getElementById("hw-search-student").value.toLowerCase();
  const filter = document.getElementById("hw-filter-status").value;

  document.querySelectorAll(".hw-grade-row").forEach(row => {
    const name = row.dataset.name;
    const status = row.dataset.status;

    const matchSearch = name.includes(search);
    const matchStatus = filter === "ALL" || status === filter;

    row.style.display = (matchSearch && matchStatus) ? "table-row" : "none";
  });
}

async function saveHomeworkGrade(subId) {
  const marks = document.getElementById(`marks_${subId}`).value;
  const feedback = document.getElementById(`feedback_${subId}`).value;
  const status = document.getElementById(`status_${subId}`).value;

  try {
    await gradeHomeworkSubmission(subId, {
      teacher_marks: marks,
      teacher_feedback: feedback,
      status: status
    });
    showToast("Grade saved successfully!");
    // Updating visual pill directly to save network call
    event.target.closest('tr').querySelector('td:nth-child(2)').innerHTML = pillFor(status);
    event.target.closest('tr').dataset.status = "CHECKED";
  } catch (err) {
    showToast(err.message);
  }
}
async function teacher_replydoubts() {
  setTitle("Reply Doubts", "Help students with their questions");

  try {
    const result = await loadTeacherDoubts();
    const doubts = result.doubts;

    const pendingCount = doubts.filter(d => d.status === "Pending").length;

    return `
        <div class="grid g3" style="margin-bottom: 20px;">
            <div class="card stat-card"><div class="lbl">Total Doubts</div><div class="val">${doubts.length}</div></div>
            <div class="card stat-card"><div class="lbl">Pending Replies</div><div class="val ${pendingCount > 0 ? 'accent' : ''}">${pendingCount}</div></div>
            <div class="card stat-card"><div class="lbl">Answered</div><div class="val good">${doubts.length - pendingCount}</div></div>
        </div>

        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3>Student Doubts</h3>
                <select id="doubt-filter" class="input-like" onchange="filterTeacherDoubts()">
                    <option value="ALL">All Doubts</option>
                    <option value="Pending">Pending Only</option>
                    <option value="Answered">Answered Only</option>
                </select>
            </div>
            
            <div id="doubts-container" style="display:flex; flex-direction:column; gap:15px;">
                ${doubts.length === 0 ? `<p>No doubts assigned to you yet.</p>` : doubts.map(d => `
                    <div class="doubt-card ledger-row" data-status="${d.status}" style="align-items:flex-start; background:var(--bg); border:1px solid var(--line); border-radius:8px; padding:15px;">
                        
                        <div class="left" style="flex-direction:column; align-items:flex-start; gap:8px; flex:1;">
                            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                                <div>
                                    <strong>${d.student_name}</strong> <span style="font-size:12px; color:var(--ink-soft); margin-left:8px;">(Roll: ${d.roll_no || 'N/A'})</span>
                                </div>
                                ${pillFor(d.status)}
                            </div>
                            
                            <div style="background:var(--surface); padding:10px; border-radius:6px; width:100%; border-left:3px solid var(--accent);">
                                <strong>Q:</strong> ${d.question}
                            </div>
                            
                            ${d.status === "Pending" ? `
                                <div style="width:100%; margin-top:10px;" id="reply-box-${d.doubt_id}">
                                    <textarea id="reply-text-${d.doubt_id}" class="full-width" rows="3" placeholder="Type your detailed answer here..."></textarea>
                                    <button class="btn-sm solid" style="margin-top:8px;" onclick="submitDoubtReply(${d.doubt_id})">Send Reply</button>
                                </div>
                            ` : `
                                <div style="background:var(--good-bg); padding:10px; border-radius:6px; width:100%; border-left:3px solid var(--good); margin-top:5px;">
                                    <strong>Your Answer:</strong> ${d.answer}
                                </div>
                            `}
                        </div>

                    </div>
                `).join("")}
            </div>
        </div>
        `;
  } catch (err) {
    return `<div class="card">Error loading doubts: ${err.message}</div>`;
  }
}

function filterTeacherDoubts() {
  const filter = document.getElementById("doubt-filter").value;
  document.querySelectorAll(".doubt-card").forEach(card => {
    if (filter === "ALL" || card.dataset.status === filter) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

async function submitDoubtReply(doubtId) {
  const answerText = document.getElementById(`reply-text-${doubtId}`).value;

  if (!answerText || answerText.trim() === "") {
    return showToast("Please type an answer before sending.");
  }

  try {
    await replyToTeacherDoubt(doubtId, answerText);
    showToast("Reply sent successfully!");
    // Refresh the UI to show it as answered
    document.getElementById("content").innerHTML = await teacher_replydoubts();
  } catch (err) {
    showToast(err.message);
  }
}
async function teacher_analytics() {
  setTitle("View Analytics", "Performance insights and recent feedback");

  try {
    const result = await loadTeacherAnalytics();
    const data = result.analytics;

    const pendingChecks = data.total_submissions - data.checked_submissions;
    const completionRate = data.total_submissions > 0 ? Math.round((data.checked_submissions / data.total_submissions) * 100) : 0;

    return `
        <div class="grid g4" style="margin-bottom:20px;">
            <div class="card stat-card">
                <div class="lbl">Total Students</div>
                <div class="val">${data.total_students}</div>
            </div>
            <div class="card stat-card">
                <div class="lbl">HW Submissions</div>
                <div class="val">${data.total_submissions}</div>
            </div>
            <div class="card stat-card">
                <div class="lbl">Pending Grading</div>
                <div class="val ${pendingChecks > 0 ? 'accent' : 'good'}">${pendingChecks}</div>
            </div>
            <div class="card stat-card">
                <div class="lbl">Grading Completion</div>
                <div class="val">${completionRate}%</div>
            </div>
        </div>

        <div class="grid g2" style="align-items: flex-start;">
            
            <div class="card">
                <h3>Batch Test Performance</h3>
                ${data.batch_performance.length === 0 ? `<p style="color:var(--ink-soft); font-size:13px; margin-top:10px;">No test data available yet.</p>` : `
                    <div style="margin-top:15px; display:flex; flex-direction:column; gap:12px;">
                        ${data.batch_performance.map(b => `
                            <div>
                                <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
                                    <strong>${b.batch_name}</strong>
                                    <span>Avg: ${Number(b.avg_score).toFixed(1)} Marks</span>
                                </div>
                                <div class="bar-bg" style="height:8px;">
                                    <div class="bar-fill ${b.avg_score > 75 ? 'good' : b.avg_score > 50 ? 'info' : 'accent'}" style="width:${Math.min(b.avg_score, 100)}%;"></div>
                                </div>
                                <div style="font-size:11px; color:var(--ink-soft); margin-top:4px;">Based on ${b.total_attempts} student attempts</div>
                            </div>
                        `).join("")}
                    </div>
                `}
            </div>

            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3>Recent Feedback Log</h3>
                    <span style="font-size:12px; color:var(--ink-soft);">Latest 15</span>
                </div>
                
                <div style="max-height:400px; overflow-y:auto; padding-right:10px; display:flex; flex-direction:column; gap:12px;">
                    ${data.recent_feedback.length === 0 ? `<p style="color:var(--ink-soft); font-size:13px;">You haven't provided any written feedback recently.</p>` :
        data.recent_feedback.map(f => `
                        <div style="background:var(--surface); border:1px solid var(--line); border-radius:8px; padding:12px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                                <strong>${f.student_name}</strong>
                                <span class="tag">${f.batch_name}</span>
                            </div>
                            <div style="font-size:12px; color:var(--ink-soft); margin-bottom:8px;">
                                Assignment: ${f.assignment_title}
                            </div>
                            <div style="background:var(--bg); padding:10px; border-left:3px solid var(--primary); border-radius:4px; font-size:13px;">
                                <em>"${f.teacher_feedback}"</em>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:11.5px; color:var(--ink-soft);">
                                <span>Marks Given: <strong>${f.teacher_marks || 'N/A'}</strong></span>
                                <span>${new Date(f.submitted_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
            
        </div>
        `;
  } catch (err) {
    return `<div class="card">Error loading analytics: ${err.message}</div>`;
  }
}
let currentChatUserId = null;

async function teacher_messageparents() {
  setTitle("Message Parents", "Communicate with student guardians");

  try {
    const result = await loadMessageContacts();
    const contacts = result.contacts;

    return `
        <div class="card" style="padding:0; display:flex; height:65vh; overflow:hidden; border:1px solid var(--line);">
            
            <div style="width:320px; border-right:1px solid var(--line); background:var(--surface); display:flex; flex-direction:column;">
                <div style="padding:15px; border-bottom:1px solid var(--line); background:var(--bg);">
                    <input type="text" id="chat-search" class="full-width" placeholder="Search parent/student..." onkeyup="filterChatContacts()" style="border-radius:20px; padding:8px 15px;">
                </div>
                <div id="contact-list" style="flex:1; overflow-y:auto;">
                    ${contacts.length === 0 ? `<div style="padding:20px; text-align:center; color:var(--ink-soft); font-size:13.5px;">No contacts found</div>` :
        contacts.map(c => `
                        <div class="chat-contact-item" data-name="${c.parent_name.toLowerCase()} ${c.student_name.toLowerCase()}" 
                             style="padding:15px; border-bottom:1px solid var(--line); cursor:pointer; transition:background 0.2s;"
                             onclick="openChatConversation(${c.parent_user_id}, '${c.parent_name}', '${c.student_name}')">
                            <strong style="display:block; font-size:14px;">${c.parent_name}</strong>
                            <span style="font-size:12px; color:var(--ink-soft);">Parent of ${c.student_name} (${c.batch_name})</span>
                        </div>
                    `).join("")}
                </div>
            </div>

            <div id="chat-window-area" style="flex:1; display:flex; flex-direction:column; background:var(--bg);">
                <div style="flex:1; display:flex; align-items:center; justify-content:center; flex-direction:column; color:var(--ink-soft);">
                    <div style="font-size:48px; margin-bottom:10px;">💬</div>
                    <p>Select a contact to start messaging</p>
                </div>
            </div>

        </div>
        `;
  } catch (err) {
    return `<div class="card">Error loading contacts: ${err.message}</div>`;
  }
}

function filterChatContacts() {
  const term = document.getElementById("chat-search").value.toLowerCase();
  document.querySelectorAll(".chat-contact-item").forEach(item => {
    item.style.display = item.dataset.name.includes(term) ? "block" : "none";
  });
}

async function openChatConversation(userId, parentName, studentName) {
  currentChatUserId = userId;

  // Highlight active contact
  document.querySelectorAll(".chat-contact-item").forEach(el => el.style.background = "transparent");
  event.currentTarget.style.background = "var(--line)";

  const chatArea = document.getElementById("chat-window-area");
  chatArea.innerHTML = `
        <div style="padding:15px 20px; border-bottom:1px solid var(--line); background:var(--surface);">
            <strong style="font-size:16px;">${parentName}</strong><br>
            <span style="font-size:12.5px; color:var(--ink-soft);">Parent of ${studentName}</span>
        </div>
        <div id="chat-messages-container" style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px;">
            <div style="text-align:center; color:var(--ink-soft); font-size:12px;">Loading messages...</div>
        </div>
        <div style="padding:15px; border-top:1px solid var(--line); background:var(--surface); display:flex; gap:10px;">
            <input type="text" id="chat-input-msg" class="full-width" placeholder="Type a message..." onkeydown="if(event.key==='Enter') submitChatMessage()">
            <button class="btn solid" onclick="submitChatMessage()">Send</button>
        </div>
    `;

  try {
    const result = await loadConversation(userId);
    renderChatMessages(result.messages, result.currentUserId);
  } catch (err) {
    document.getElementById("chat-messages-container").innerHTML = `<div style="color:var(--bad); text-align:center;">Error loading chat.</div>`;
  }
}

function renderChatMessages(messages, myUserId) {
  const container = document.getElementById("chat-messages-container");
  if (messages.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:var(--ink-soft); font-size:12px; margin-top:20px;">No previous messages. Say hi!</div>`;
    return;
  }

  container.innerHTML = messages.map(m => {
    const isMe = m.sender_id === myUserId;
    const time = new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `
            <div style="align-self: ${isMe ? 'flex-end' : 'flex-start'}; max-width: 75%;">
                <div style="background: ${isMe ? 'var(--primary)' : 'var(--bg)'}; 
                            color: ${isMe ? '#fff' : 'var(--ink)'}; 
                            border: 1px solid ${isMe ? 'var(--primary)' : 'var(--line)'};
                            padding: 10px 14px; border-radius: 8px; font-size:13.5px; line-height:1.4;">
                    ${m.content}
                </div>
                <div style="font-size:10px; color:var(--ink-soft); margin-top:4px; text-align:${isMe ? 'right' : 'left'};">
                    ${time}
                </div>
            </div>
        `;
  }).join("");

  // Auto-scroll to bottom
  container.scrollTop = container.scrollHeight;
}

async function submitChatMessage() {
  const input = document.getElementById("chat-input-msg");
  const content = input.value.trim();
  if (!content || !currentChatUserId) return;

  input.value = ""; // clear instantly for better UX

  try {
    await sendMessageApi(currentChatUserId, content);
    // Reload conversation to show new message
    const result = await loadConversation(currentChatUserId);
    renderChatMessages(result.messages, result.currentUserId);
  } catch (err) {
    showToast(err.message);
    input.value = content; // restore text if failed
  }
}

/* ---- ADMIN ---- */
async function admin_dashboard() {
  setTitle("Dashboard", "Academy-wide snapshot");
  return `<div class="grid g4" style="margin-bottom:18px;">
    <div class="card stat-card"><div class="lbl">Total students</div><div class="val" id="studentCount">0</div><div class="delta up">▲ 18 this week</div></div>
    <div class="card stat-card"><div class="lbl">Fee collected (Jun)</div><div class="val" id="feeCollected">₹0</div><div class="delta up">92% of target</div></div>
    <div class="card stat-card"><div class="lbl">Teachers</div><div class="val" id="teacherCount">0</div></div>
    <div class="card stat-card"><div class="lbl">Avg attendance</div><div class="val" id="attendanceCount">0%</div><div class="delta up">▲ 1.2%</div></div>
  </div>
  <div class="grid g2">
    <div class="card">
    <h3>Recent Admissions</h3>
    <div id="recentAdmissions"> 
        Loading...
    </div>
</div>
    <div class="card"><h3>Fee Collection Status</h3>
      <div class="bar-bg"><div class="bar-fill good" style="width:73%"></div></div>
      <div style="font-size:12.5px; color:var(--ink-soft); margin-top:8px; margin-bottom:14px;">₹68.4L collected of ₹93.6L expected for June</div>
      ${["IIT-A", "NEET-B", "Foundation-C"].map((b, i) => `<div class="ledger-row"><span>${b}</span><span class="mono">${[88, 76, 69][i]}% collected</span></div>`).join("")}
    </div>
  </div>`;
};
async function admin_admissions() {
  setTitle("Admissions", "New enquiries and confirmations");
  return `<div class="card" style="margin-bottom:18px;"><h3>New admission</h3>
    <div class="grid g3">
      <div class="field"><label>Student name</label><input placeholder="Full name"></div>
      <div class="field"><label>Class</label><select class="input-like" style="width:100%;"><option>11</option><option>12</option></select></div>
      <div class="field"><label>Batch</label><select class="input-like" style="width:100%;"><option>IIT-A</option><option>NEET-B</option><option>Foundation-C</option></select></div>
    </div>
    <button class="btn-sm solid" onclick="showToast('Admission record created')">Add student</button></div>
  <div class="card"><table><thead><tr><th>Name</th><th>Batch</th><th>Date</th><th>Status</th></tr></thead><tbody>
    <div id="recentAdmissions"></div>
  </tbody></table></div>`;
};

async function admin_timetable() {

  setTitle(
    "Timetable",
    "Manage institute timetable"
  );

  const timetable = await loadTimetable();

  const assignments = await loadAssignments();

  return `

<div class="card">

<h3>Add Timetable</h3>

<div class="grid g4">

<div>

<label>Assignment</label>

<select id="ttAssignment">

${assignments.map(a => `

<option value="${a.id}">

${a.teacher_name}
-
${a.subject_name}
-
${a.batch_name}

</option>

`).join("")}

</select>

</div>

<div>

<label>Day</label>

<select id="ttDay">

<option>Monday</option>
<option>Tuesday</option>
<option>Wednesday</option>
<option>Thursday</option>
<option>Friday</option>
<option>Saturday</option>

</select>

</div>

<div>

<label>Start</label>

<input
type="time"
id="ttStart">

</div>

<div>

<label>End</label>

<input
type="time"
id="ttEnd">

</div>

</div>

<br>

<button
class="btn solid"
onclick="saveTimetable()">

Save Timetable

</button>

</div>

<br>

<div class="card">

<h3>Timetable</h3>

<table class="table">

<thead>

<tr>

<th>Day</th>

<th>Time</th>

<th>Teacher</th>

<th>Subject</th>

<th>Batch</th>

<th></th>

</tr>

</thead>

<tbody>

${timetable.map(t => `

<tr>

<td>${t.day_name}</td>

<td>

${t.start_time}
-
${t.end_time}

</td>

<td>${t.teacher_name}</td>

<td>${t.subject_name}</td>

<td>${t.batch_name}</td>

<td>

<button
class="btn-sm danger"
onclick="deleteTimetable(${t.timetable_id})">

Delete

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

};

async function admin_feecollection() {
  setTitle("Fee Collection", "Track and record student dues");

  try {
    const result = await loadFeeDashboard();
    const allFees = result.allFees;
    const pendingFees = result.pendingFees;

    return `
        <div class="card" style="margin-bottom:18px;">
            <h3>Collect a payment</h3>
            <div class="grid g3">
                <div class="field">
                    <label>Student (Pending Dues)</label>
                    <select id="fee-student-select" class="input-like" style="width:100%;" onchange="autoFillFeeAmount()">
                        <option value="">-- Select Student --</option>
                        ${pendingFees.map(f => `<option value="${f.fee_id}" data-amount="${f.amount}">${f.student_name} (${f.batch_name})</option>`).join("")}
                    </select>
                </div>
                <div class="field">
                    <label>Amount (₹)</label>
                    <input type="number" id="fee-amount" placeholder="0" readonly style="background:var(--surface); cursor:not-allowed;">
                </div>
                <div class="field">
                    <label>Payment Mode</label>
                    <select id="fee-mode" class="input-like" style="width:100%;">
                        <option value="UPI">UPI</option>
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>
            </div>
            <button class="btn-sm solid" style="margin-top:14px;" onclick="submitFeePayment()">Record Payment</button>
        </div>

        <div class="card">
            <h3>Fee Status Ledger</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Batch</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${allFees.length === 0 ? `<tr><td colspan="5" style="text-align:center; color:var(--ink-soft);">No fee records found.</td></tr>` :
        allFees.map(f => `
                        <tr>
                            <td><strong>${f.student_name}</strong></td>
                            <td>${f.batch_name}</td>
                            <td class="mono">₹${Number(f.amount).toLocaleString("en-IN")}</td>
                            <td class="mono">${new Date(f.due_date).toLocaleDateString()}</td>
                            <td>${pillFor(f.status)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
        `;
  } catch (err) {
    return `<div class="card">Error loading fees: ${err.message}</div>`;
  }
}

function autoFillFeeAmount() {
  const select = document.getElementById("fee-student-select");
  const amountInput = document.getElementById("fee-amount");

  if (select.selectedIndex > 0) {
    // Get the data-amount attribute from the selected option
    const amount = select.options[select.selectedIndex].dataset.amount;
    amountInput.value = amount;
  } else {
    amountInput.value = "";
  }
}

async function submitFeePayment() {
  const feeId = document.getElementById("fee-student-select").value;
  const amount = document.getElementById("fee-amount").value;
  const mode = document.getElementById("fee-mode").value;

  if (!feeId || !amount) {
    return showToast("Please select a student with pending dues.");
  }

  try {
    await recordFeePaymentApi(feeId, amount, mode);
    showToast("Payment recorded successfully!");

    // Refresh the UI to update the table and clear the dropdown
    document.getElementById("content").innerHTML = await admin_feecollection();
  } catch (err) {
    showToast(err.message);
  }
}
async function admin_teachers() {

  setTitle("Teachers", "Manage teaching staff");

  const teachers = await loadTeachers();

  return `
        <div class="toolbar">

            <button class="btn solid"
                onclick="showAddTeacherForm()">

                + Add Teacher

            </button>

        </div>

        <table class="table">

            <thead>

                <tr>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Phone</th>

                    <th>Qualification</th>

                    <th>Experience</th>

                    <th>Salary</th>
                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

                ${teachers.map(t => `

                    <tr>

                        <td>${t.full_name}</td>

                        <td>${t.email}</td>

                        <td>${t.phone}</td>

                        <td>${t.qualification}</td>

                        <td>${t.experience} yrs</td>

                        <td>₹${Number(t.salary).toLocaleString("en-IN")}</td>

<td>
    <button class="btn-sm"
        onclick="editTeacher(${t.teacher_id})">
        ✏ Edit
    </button>

    <button class="btn-sm danger"
        onclick="deleteTeacher(${t.teacher_id})">
        🗑 Delete
    </button>
</td>

                    </tr>

                `).join("")}

            </tbody>

        </table>
    `;
}

function showAddTeacherForm() {
    // 1. Update the UI to show the form
    const contentArea = document.getElementById('content');
    
    // 2. Set the Title/Crumb
    document.getElementById('page-title').innerText = "Add New Member";
    document.getElementById('page-crumb').innerText = "User Management";

    // 3. Inject the form HTML
    contentArea.innerHTML = `
    <div class="card">
        <h3>Create New User (Student/Teacher)</h3>
        <form id="adminCreateUserForm" onsubmit="handleCreateUser(event)">
            <div class="field"><label>Full Name</label><input type="text" id="add_name" required></div>
            <div class="field"><label>Phone</label><input type="text" id="add_phone" required></div>
            <div class="field"><label>Role</label>
                <select id="add_role">
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                </select>
            </div>
            <div class="field"><label>Temporary Password</label><input type="password" id="add_password" required></div>
            <button type="submit" class="btn-primary">Create User</button>
        </form>
    </div>`;
}
async function admin_classes() {
  setTitle("Create Classes", "Define class levels");
  return `<div class="card" style="margin-bottom:18px;"><h3>New class</h3>
    <div class="grid g3">
        <div class="field"><label>Class name</label><input id="class_name" placeholder="Class 12"></div>
        <div class="field"><label>Stream</label>
            <select id="class_stream" class="input-like" style="width:100%;">
                <option>JEE</option><option>NEET</option><option>Foundation</option>
            </select>
        </div>
        <div class="field"><label>Academic year</label><input id="class_year" placeholder="2026–27"></div>
    </div>
    <button class="btn-sm solid" onclick="saveClass()">Create class</button></div>
  <div class="grid g3" id="class-list">
    </div>`;
};

async function saveClass() {
    const classData = {
        class_name: document.getElementById('class_name').value,
        stream: document.getElementById('class_stream').value,
        academic_year: document.getElementById('class_year').value
    };

    try {
        await apiRequest("/classes", "POST", classData);
        showToast("Class created successfully!");
        
        // Refresh the section to show the new class
        document.getElementById('content').innerHTML = await admin_classes();
    } catch (err) {
        showToast("Error: " + err.message);
    }
}
async function admin_batches() {
  setTitle("Create Batches", "Group students for teaching");
  
  // You should fetch classes dynamically for the <select> dropdown here
  return `
    <div class="card" style="margin-bottom:18px;">
        <h3>New batch</h3>
        <div class="grid g3">
            <div class="field"><label>Batch name</label><input id="batch_name" placeholder="IIT-A"></div>
            <div class="field"><label>Class</label>
                <select id="batch_class" class="input-like" style="width:100%;">
                    <option value="11">11</option>
                    <option value="12">12</option>
                </select>
            </div>
            <div class="field"><label>Capacity</label><input type="number" id="batch_capacity" placeholder="60"></div>
        </div>
        <button class="btn-sm solid" onclick="saveBatch()">Create batch</button>
    </div>
    <div class="card">
        <table>
            <thead><tr><th>Batch</th><th>Class</th><th>Students</th><th>Capacity</th></tr></thead>
            <tbody id="batchTableBody">
                <tr><td colspan="4">Loading...</td></tr>
            </tbody>
        </table>
    </div>`;
};

async function saveBatch() {
    const batchData = {
        batch_name: document.getElementById('batch_name').value,
        class_id: document.getElementById('batch_class').value,
        capacity: document.getElementById('batch_capacity').value
    };

    try {
        await apiRequest("/batches", "POST", batchData);
        showToast("Batch created successfully!");
        // Refresh the list
        await loadBatches(); 
    } catch (err) {
        showToast("Error: " + err.message);
    }
}

async function loadBatches() {
    try {
        const result = await apiRequest("/batches"); // Assumes GET /batches returns list
        const tbody = document.getElementById("batchTableBody");
        tbody.innerHTML = result.batches.map(b => `
            <tr>
                <td>${b.batch_name}</td>
                <td>${b.class_name}</td>
                <td class="mono">${b.student_count || 0}</td>
                <td class="mono">${b.capacity}</td>
            </tr>
        `).join("");
    } catch (err) {
        showToast("Failed to load batches");
    }
}
async function admin_students() {

  const content = document.getElementById("content");

  content.innerHTML = `
        <div class="page-header">
            <h2>Students</h2>

            <button class="btn-primary" onclick="openStudentModal()">
                + Add Student
            </button>
        </div>

        <div class="card">

            <table class="table">

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Phone</th>

                        <th>Roll No</th>

                        <th>Class</th>

                        <th>Batch</th>

                    </tr>

                </thead>

                <tbody id="studentTable">

                    <tr>

                        <td colspan="5">

                            Loading...

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

        <div id="studentModal"></div>
    `;

  loadStudents();

};

async function openStudentModal() {

  const classes = await apiRequest("/classes");

  const batches = await apiRequest("/batches");

  const modal = document.getElementById("studentModal");

  modal.innerHTML = `

    <div class="modal">

        <div class="modal-box">

            <h2>Add Student</h2>

            <input id="studentName" placeholder="Full Name">

            <input id="studentPhone" placeholder="Phone">

            <input id="studentEmail" placeholder="Email">

            <input id="studentPassword" placeholder="Password">

            <input id="studentRoll" placeholder="Roll No">

            <select id="studentGender">

                <option>Male</option>

                <option>Female</option>

                <option>Other</option>

            </select>

            <input id="studentDob" type="date">

            <input id="studentAddress" placeholder="Address">

            <input id="studentBlood" placeholder="Blood Group">

            <input id="studentAadhaar" placeholder="Aadhaar">

            <select id="studentClass">

                ${classes.classes.map(c => `

                    <option value="${c.class_id}">

                        ${c.class_name}

                    </option>

                `).join("")}

            </select>

            <select id="studentBatch">

                ${batches.batches.map(b => `

                    <option value="${b.batch_id}">

                        ${b.batch_name}

                    </option>

                `).join("")}

            </select>

            <input id="studentAdmission" type="date">

            <button onclick="saveStudent()">

                Save

            </button>

        </div>

    </div>

    `;

};

async function loadStudents() {

  try {

    const result = await apiRequest(

      "/students"

    );

    const tbody = document.getElementById("studentTable");

    tbody.innerHTML = "";

    result.students.forEach(student => {

      tbody.innerHTML += `

            <tr>

                <td>${student.full_name}</td>

                <td>${student.phone}</td>

                <td>${student.roll_no}</td>

                <td>${student.class_name ?? "-"}</td>

                <td>${student.batch_name ?? "-"}</td>

            </tr>

            `;

    });

  }

  catch (err) {

    showToast("Unable to load students");

  }

};

async function saveStudent() {

  try {

    await apiRequest(

      "/students",

      "POST",

      {

        full_name: studentName.value,

        phone: studentPhone.value,

        email: studentEmail.value,

        password: studentPassword.value,

        roll_no: studentRoll.value,

        gender: studentGender.value,

        dob: studentDob.value,

        address: studentAddress.value,

        blood_group: studentBlood.value,

        aadhaar_no: studentAadhaar.value,

        class_id: studentClass.value,

        batch_id: studentBatch.value,

        admission_date: studentAdmission.value

      }

    );

    showToast("Student Added");

    admin_students();

  }

  catch (err) {

    showToast(err.message);

  }

};

async function admin_notices() {
  setTitle("Upload Notices", "Publish announcements to students and staff");

  try {
    const result = await loadNotices();
    const notices = result.notices;

    return `
        <div class="card" style="margin-bottom:18px;">
            <h3>Create New Notice</h3>
            <div class="field" style="margin-bottom:12px;">
                <label>Notice Title</label>
                <input type="text" id="notice-title" class="full-width" placeholder="e.g., Holiday Announcement for Diwali">
            </div>
            <div class="field" style="margin-bottom:12px;">
                <label>Message / Description</label>
                <textarea id="notice-desc" class="full-width" rows="4" placeholder="Write the full notice details here..."></textarea>
            </div>
            <button class="btn-sm solid" onclick="submitNewNotice()">Publish Notice</button>
        </div>

        <div class="card">
            <h3>Published Notices</h3>
            <div style="display:flex; flex-direction:column; gap:12px; margin-top:15px;">
                ${notices.length === 0 ? `<p style="color:var(--ink-soft); font-size:13px;">No notices have been published yet.</p>` :
        notices.map(n => `
                    <div style="background:var(--surface); border:1px solid var(--line); border-radius:8px; padding:15px; display:flex; justify-content:space-between; align-items:flex-start;">
                        <div style="flex:1;">
                            <strong style="font-size:15px;">${n.title}</strong>
                            <p style="font-size:13.5px; color:var(--ink); margin:8px 0;">${n.description.replace(/\n/g, '<br>')}</p>
                            <div style="font-size:11.5px; color:var(--ink-soft); display:flex; gap:15px;">
                                <span>📅 ${new Date(n.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                <span>👤 Posted by: ${n.created_by_name || 'Admin'}</span>
                            </div>
                        </div>
                        <button class="btn-sm danger" style="margin-left:15px;" onclick="deleteNoticeUI(${n.notice_id})">🗑 Delete</button>
                    </div>
                `).join("")}
            </div>
        </div>
        `;
  } catch (err) {
    return `<div class="card">Error loading notices: ${err.message}</div>`;
  }
}

async function submitNewNotice() {
  const title = document.getElementById("notice-title").value;
  const desc = document.getElementById("notice-desc").value;

  if (!title.trim() || !desc.trim()) {
    return showToast("Please provide both a title and a description.");
  }

  try {
    await createNoticeApi(title, desc);
    showToast("Notice published successfully!");
    // Refresh UI
    document.getElementById("content").innerHTML = await admin_notices();
  } catch (err) {
    showToast(err.message);
  }
}

async function deleteNoticeUI(noticeId) {
  if (confirm("Are you sure you want to delete this notice? It will be removed for everyone.")) {
    try {
      await deleteNoticeApi(noticeId);
      showToast("Notice deleted.");
      // Refresh UI
      document.getElementById("content").innerHTML = await admin_notices();
    } catch (err) {
      showToast(err.message);
    }
  }
}
async function admin_reports() {
  setTitle("Reports", "Download academy-wide reports in CSV format");

  // Using current date for dynamic UI text
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return `
    <div class="grid g3">
        
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
                <div style="font-size:26px; margin-bottom:10px;">💳</div>
                <h3>Fee Collection Report</h3>
                <div style="font-size:12.5px; color:var(--ink-soft); margin-bottom:14px; margin-top:4px;">${currentMonth} · CSV Export</div>
            </div>
            <button class="btn primary full-width" onclick="downloadReport('fees', 'Fee_Collection_Report')">Generate CSV</button>
        </div>

        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
                <div style="font-size:26px; margin-bottom:10px;">🎓</div>
                <h3>Admissions Report</h3>
                <div style="font-size:12.5px; color:var(--ink-soft); margin-bottom:14px; margin-top:4px;">All time · CSV Export</div>
            </div>
            <button class="btn primary full-width" onclick="downloadReport('admissions', 'Admissions_Report')">Generate CSV</button>
        </div>

        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
                <div style="font-size:26px; margin-bottom:10px;">🧑‍🏫</div>
                <h3>Faculty Roster Report</h3>
                <div style="font-size:12.5px; color:var(--ink-soft); margin-bottom:14px; margin-top:4px;">Current Staff · CSV Export</div>
            </div>
            <button class="btn primary full-width" onclick="downloadReport('faculty', 'Faculty_Roster_Report')">Generate CSV</button>
        </div>

        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
                <div style="font-size:26px; margin-bottom:10px;">👥</div>
                <h3>Batch-wise Report</h3>
                <div style="font-size:12.5px; color:var(--ink-soft); margin-bottom:14px; margin-top:4px;">Batch Capacities · CSV Export</div>
            </div>
            <button class="btn primary full-width" onclick="downloadReport('batches', 'Batch_Summary_Report')">Generate CSV</button>
        </div>

    </div>
    `;
}

async function downloadReport(reportType, fileName) {
  try {
    showToast("Generating report, please wait...");
    const result = await fetchReportData(reportType);

    if (!result.data || result.data.length === 0) {
      return showToast("No data available for this report.");
    }

    // 1. Convert JSON to CSV format
    const csvContent = convertToCSV(result.data);

    // 2. Create a Blob from the CSV string
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // 3. Create a hidden link and trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();

    // 4. Cleanup
    document.body.removeChild(link);
    showToast("Download started!");

  } catch (err) {
    showToast(err.message);
  }
}

function convertToCSV(objArray) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  // Extract headers (keys from the first object)
  const headers = Object.keys(array[0]);
  str += headers.join(',') + '\r\n';

  // Extract data rows
  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line !== '') line += ',';

      // Format data: wrap in quotes and escape internal quotes to prevent CSV breaking
      let cellData = array[i][index] !== null ? array[i][index].toString() : '';
      // If it contains a comma or newline, wrap it in double quotes
      if (cellData.includes(',') || cellData.includes('\n') || cellData.includes('"')) {
        cellData = `"${cellData.replace(/"/g, '""')}"`;
      }
      line += cellData;
    }
    str += line + '\r\n';
  }
  return str;
}
async function admin_analytics() {
  setTitle("Analytics", "Academy performance trends");

  try {
    const result = await loadAdminAnalytics();
    const data = result.data;
    const trend = data.enrollmentTrend;

    // Calculate max value to scale the bar chart properly
    // Minimum max value of 10 to avoid huge bars if there are only 1 or 2 students
    const maxCount = trend.length > 0 ? Math.max(...trend.map(t => t.count), 10) : 10;

    return `
        <div class="grid g3" style="margin-bottom:18px;">
            <div class="card stat-card">
                <div class="lbl">Avg test score</div>
                <div class="val">${data.avgScore}%</div>
            </div>
            <div class="card stat-card">
                <div class="lbl">Dropout risk</div>
                <div class="val ${data.riskCount > 0 ? 'accent' : 'good'}">${data.riskCount}</div>
                <div class="delta down">Students scoring < 40%</div>
            </div>
            <div class="card stat-card">
                <div class="lbl">Top batch</div>
                <div class="val mono" style="font-size:20px; color:var(--primary);">${data.topBatch}</div>
            </div>
        </div>

        <div class="card">
            <h3>Enrollment trend (Current Year)</h3>
            <div style="display:flex; align-items:flex-end; gap:16px; height:180px; padding-top:20px;">
                ${trend.length === 0 ? `<div style="color:var(--ink-soft); font-size:13px; width:100%; text-align:center; padding-bottom:20px;">No admission data available for this year yet.</div>` :
        trend.map(item => {
          // Scale height relative to the max count (max height 140px)
          const barHeight = Math.max((item.count / maxCount) * 140, 4);
          return `
                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px;">
                        <span style="font-size:11px; color:var(--ink); font-weight:bold;">${item.count}</span>
                        <div style="width:100%; background:var(--accent); border-radius:6px 6px 0 0; height:${barHeight}px; transition: height 0.5s ease;"></div>
                        <span style="font-size:12px; color:var(--ink-soft); font-weight:500;">${item.month_name}</span>
                    </div>
                    `;
        }).join("")}
            </div>
        </div>
        `;
  } catch (err) {
    return `<div class="card">Error loading analytics: ${err.message}</div>`;
  }
}

const renderers = {
  student_dashboard,
  student_timetable,
  student_attendance,
  student_homework,
  student_notes,
  student_lectures,
  student_tests,
  student_results: student_results,
  student_fees,
  student_doubts : student_doubts,
  student_aichat : student_aichat,

  parent_dashboard : parent_dashboard,
  parent_liveattendance: parent_liveattendance,
  parent_fees,
  parent_performance,
  parent_homeworkstatus,
  parent_remarks,
  parent_monthly,
  parent_exams,
  parent_notice,
  parent_chat,

  teacher_dashboard,
  teacher_markattendance,
  teacher_uploadhomework,
  teacher_uploadnotes,
  teacher_uploadvideos,
  teacher_generatetests,
  teacher_checkhomework,
  teacher_replydoubts,
  teacher_analytics,
  teacher_messageparents,

  admin_dashboard,
  admin_admissions,

  admin_students,
  admin_teachers,

  admin_subjects,
  admin_assignments,

  admin_classes,
  admin_batches,

  admin_timetable,

  admin_feecollection,
  admin_notices,
  admin_reports,
  admin_analytics
};

function uploadForm(kind, placeholder) {
  return `<div class="card" style="margin-bottom:18px;">
    <div class="grid g2">
      <div class="field"><label>Title</label><input placeholder="${placeholder}"></div>
      <div class="field"><label>Batch</label><select class="input-like" style="width:100%;"><option>IIT-A</option><option>NEET-B</option><option>Foundation-C</option></select></div>
    </div>
    <div class="upload-zone">⬆ Drag and drop a ${kind} file here, or click to browse</div>
    <button class="btn-sm solid" style="margin-top:14px;" onclick="showToast('${kind.charAt(0).toUpperCase() + kind.slice(1)} uploaded to batch')">Publish</button>
  </div>`;
}

function chatUI(name, msgs) {
  setTitle("Messages", "Conversation with " + name);
  return `<div class="chat-window">
    <div class="chat-list" id="chat-list">
      ${msgs.map(m => `<div class="msg ${m.who}">${m.text}<span class="time">${m.t}</span></div>`).join("")}
    </div>
    <div class="chat-input">
      <input id="chat-input-field" placeholder="Type a message…" onkeydown="if(event.key==='Enter')sendChat()">
      <button class="btn-sm solid" onclick="sendChat()">Send</button>
    </div>
  </div>`;
}
function sendChat() {
  const f = document.getElementById("chat-input-field");
  if (!f.value.trim()) return;
  const list = document.getElementById("chat-list");
  const div = document.createElement("div");
  div.className = "msg out";
  div.innerHTML = f.value + `<span class="time">Now</span>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
  f.value = "";
}

async function renderSection() {

  const key = `${state.role}_${state.section}`;

  const fn = renderers[key];

  if (!fn) {
    document.getElementById("content").innerHTML = `
            <div class="card empty">
                <div class="ic">🚧</div>
                <h3>Coming Soon</h3>
            </div>
        `;
    return;
  }

  if (key === "admin_students") {
    await admin_students();
    return;
  }

  document.getElementById("content").innerHTML = await fn();

  if (key === "admin_dashboard") {
    loadDashboardStats();
  }
}

window.onload = async () => {

  const token = localStorage.getItem("token");

  const user = JSON.parse(

    localStorage.getItem("user")

  );

  if (token && user) {

    state.role = user.role.toLowerCase();

    state.section = NAV[state.role][0][0];

    document.getElementById("login-screen").style.display = "none";

    document.getElementById("app-screen").style.display = "block";

    document.getElementById("user-name").textContent = user.name;

    document.getElementById("user-sub").textContent = user.role;

    document.getElementById("user-avatar").textContent = user.name.charAt(0);

    document.getElementById("role-pill").textContent = ROLE_META[state.role].label;

    buildNav();

    await renderSection();

  }

}

async function loadTeachers() {

  const result = await apiRequest("/teachers");

  return result.teachers;

}

async function deleteTeacher(id) {

  if (!confirm("Delete this teacher?")) {

    return;

  }

  await apiRequest(

    "/teachers/" + id,

    "DELETE"

  );

  showToast("Teacher deleted");

  renderSection();

}

async function loadTimetable() {

  const result = await apiRequest("/timetable");

  return result.timetable;

}

async function loadAssignments() {

  const result = await apiRequest("/assignments");

  return result.assignments;

}

async function saveTimetable() {

  await apiRequest(

    "/timetable",

    "POST",

    {

      assignment_id:
        document.getElementById("ttAssignment").value,

      day_name:
        document.getElementById("ttDay").value,

      start_time:
        document.getElementById("ttStart").value,

      end_time:
        document.getElementById("ttEnd").value

    }

  );

  showToast("Timetable Added");

  renderSection();

}

async function deleteTimetable(id) {

  if (!confirm("Delete timetable?"))
    return;

  await apiRequest(

    "/timetable/" + id,

    "DELETE"

  );

  showToast("Deleted");

  renderSection();

}

async function admin_subjects() {

  setTitle("Subjects", "Manage institute subjects");

  const result = await apiRequest("/subjects");

  const subjects = result.subjects;

  return `
    <div class="card">

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">

            <h3>Subjects</h3>

            <button class="btn solid" onclick="showToast('Add Subject modal coming next')">
                + Add Subject
            </button>

        </div>

        <table class="table">

            <thead>

                <tr>

                    <th>Name</th>

                    <th>Code</th>

                    <th>Class</th>

                </tr>

            </thead>

            <tbody>

                ${subjects.map(s => `

                    <tr>

                        <td>${s.subject_name}</td>

                        <td>${s.subject_code}</td>

                        <td>${s.class_name}</td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    </div>
    `;

}

async function admin_assignments() {

  setTitle(
    "Teacher Assignment",
    "Assign teachers to subjects"
  );

  const assignments = await loadAssignments();

  return `

<div class="card">

<h3>Teacher Assignments</h3>

<table class="table">

<thead>

<tr>

<th>Teacher</th>

<th>Subject</th>

<th>Batch</th>

</tr>

</thead>

<tbody>

${assignments.map(a => `

<tr>

<td>${a.teacher_name}</td>

<td>${a.subject_name}</td>

<td>${a.batch_name}</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

}

async function loadNotesOptions() {

  return await apiRequest(
    "/notes/options"
  );

}

async function uploadNotes(formData) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/notes`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`
      },

      body: formData
    }
  );

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data.message || "Upload Failed"
    );

  }

  return data;

}

async function loadTeacherNotes() {

  return await apiRequest(
    "/notes"
  );

}

async function saveNotes() {

  const formData = new FormData();

  formData.append(
    "teacher_subject_id",
    document.getElementById("note-assignment").value
  );

  formData.append(
    "title",
    document.getElementById("note-title").value
  );

  formData.append(
    "description",
    document.getElementById("note-description").value
  );

  const file =
    document.getElementById("note-file").files[0];

  if (file) {

    formData.append("file", file);

  }

  try {

    const result =
      await uploadNotes(formData);

    showToast(result.message);

    await renderSection();

  }

  catch (err) {

    showToast(err.message);

  }

}

async function loadTeacherDashboard() {
  return await apiRequest("/teacher/dashboard");
}

async function loadHomeworkOptions() {

  return await apiRequest(
    "/homework/options"
  );

}

async function uploadHomework(data) {

  return await apiRequest(
    "/homework",
    "POST",
    data
  );

}

async function loadTeacherHomework() {

  return await apiRequest(
    "/homework"
  );

}

async function saveHomework() {

  const data = {

    teacher_subject_id:
      Number(
        document.getElementById("hw-assignment").value
      ),

    title:
      document.getElementById("hw-title").value,

    description:
      document.getElementById("hw-description").value,

    due_date:
      document.getElementById("hw-date").value

  };

  try {

    const result =
      await uploadHomework(data);

    showToast(result.message);

    await renderSection();

  }

  catch (err) {

    showToast(err.message);

  }

}



// async function teacher_checkhomework() {

//     setTitle("Generate Tests", "Coming Soon");

//     return `
//         <div class="card">
//             <h3>Generate Tests</h3>
//             <p>This module will be connected to the database next.</p>
//         </div>
//     `;

// }

// async function teacher_replydoubts() {

//     setTitle("Generate Tests", "Coming Soon");

//     return `
//         <div class="card">
//             <h3>Generate Tests</h3>
//             <p>This module will be connected to the database next.</p>
//         </div>
//     `;

// }
async function teacher_uploadnotes() {

  setTitle(
    "Upload Notes",
    "Upload PDF notes for your students"
  );

  const optionResult = await loadNotesOptions();
  const assignments = optionResult.assignments;

  const notesResult = await loadTeacherNotes();
  const notes = notesResult.notes;

  return `

<div class="grid g2">

    <!-- Upload Card -->

    <div class="card">

        <h3>📄 Upload Notes</h3>

        <div class="form-grid">

            <div>

                <label>Subject / Batch</label>

                <select id="note-assignment">

                    ${assignments.map(a => `

                        <option value="${a.teacher_subject_id}">

                            ${a.subject_name} - ${a.batch_name}

                        </option>

                    `).join("")}

                </select>

            </div>

        </div>

        <br>

        <label>Title</label>

        <input

            id="note-title"

            class="full-width"

            type="text"

            placeholder="Chapter 1 Notes"

        >

        <br><br>

        <label>Description</label>

        <textarea

            id="note-description"

            class="full-width"

            rows="4"

            placeholder="Write description..."

        ></textarea>

        <br><br>

        <label>Select PDF</label>

        <input

            id="note-file"

            type="file"

            accept=".pdf"

        >

        <br><br>

        <button

            class="btn primary"

            onclick="saveNotes()"

        >

            📤 Upload Notes

        </button>

    </div>

    <!-- Notes List -->

    <div class="card">

        <h3>📚 Uploaded Notes (${notes.length})</h3>

        <input

            id="search-note"

            class="full-width"

            type="text"

            placeholder="🔍 Search Notes"

            onkeyup="filterNotes()"

        >

        <br><br>

        ${notes.length === 0 ?

      `<p>No notes uploaded yet.</p>`

      :

      notes.map(note => `

                <div

                    class="ledger-row note-card"

                    data-title="${note.title.toLowerCase()}"

                    data-subject="${note.subject_name.toLowerCase()}"

                >

                    <div>

                        <strong>${note.title}</strong>

                        <br>

                        ${note.subject_name} - ${note.batch_name}

                        <br>

                        <small>

                            ${new Date(note.created_at).toLocaleDateString()}

                        </small>

                    </div>

                    <div style="display:flex;gap:8px;">

                        <a

                            href="${note.file_path.startsWith('http') ? note.file_path : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : '') + note.file_path}"

                            target="_blank"

                            class="btn secondary"

                        >

                            ⬇ Download

                        </a>

                        <button

                            class="btn warning"

                            onclick="editNote(${note.note_id})"

                        >

                            ✏ Edit

                        </button>

                        <button

                            class="btn danger"

                            onclick="removeNote(${note.note_id})"

                        >

                            🗑 Delete

                        </button>

                    </div>

                </div>

            `).join("")

    }

    </div>

</div>

`;

}

function filterNotes() {

  const search = document
    .getElementById("search-note")
    .value
    .toLowerCase();

  document.querySelectorAll(".note-card").forEach(card => {

    const title = card.dataset.title;
    const subject = card.dataset.subject;

    if (
      title.includes(search) ||
      subject.includes(search)
    ) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }

  });

}

async function saveNotes() {

  try {

    const assignment =
      document.getElementById("note-assignment").value;

    const title =
      document.getElementById("note-title").value.trim();

    const description =
      document.getElementById("note-description").value.trim();

    const file =
      document.getElementById("note-file").files[0];

    if (!assignment || !title || !file) {

      showToast("Please fill all required fields.");

      return;

    }

    const formData = new FormData();

    formData.append(
      "teacher_subject_id",
      assignment
    );

    formData.append(
      "title",
      title
    );

    formData.append(
      "description",
      description
    );

    formData.append(
      "pdf",
      file
    );

    const result = await uploadNote(formData);

    showToast(result.message);

    await renderSection();

  }

  catch (err) {

    showToast(err.message);

  }

}

async function removeNote(noteId) {
  if (!confirm("Delete this note?")) {
    return;
  }
  try {
    const result = await apiDeleteNote(noteId);
    showToast(result.message);
    await renderSection();
  } catch (err) {
    showToast(err.message);
  }
}
async function teacher_uploadvideos() {

  setTitle(
    "Upload Videos",
    "Publish recorded lectures"
  );

  const optionResult = await loadVideoOptions();

  const assignments = optionResult.assignments;

  const result = await loadTeacherVideos();

  const videos = result.videos;

  return `

<div class="grid g2">

    <div class="card">

        <h3>📺 Upload Video</h3>

        <label>Subject / Batch</label>

        <select id="video-assignment">

            ${assignments.map(a => `

            <option value="${a.teacher_subject_id}">

                ${a.subject_name} - ${a.batch_name}

            </option>

            `).join("")}

        </select>

        <br><br>

        <label>Title</label>

        <input
            id="video-title"
            class="full-width"
            placeholder="Rotational Motion Part-3"
        >

        <br><br>

        <label>Description</label>

        <textarea
            id="video-description"
            class="full-width"
            rows="5"
            placeholder="Lecture description..."
        ></textarea>

        <br><br>

        <label>Video Type</label>

        <select id="video-type">

            <option value="YouTube">YouTube</option>

            <option value="Drive">Google Drive</option>

        </select>

        <br><br>

        <label>Video URL</label>

        <input
            id="video-url"
            class="full-width"
            placeholder="Paste YouTube or Drive link"
        >

        <br><br>

        <button
            class="btn primary"
            onclick="saveVideo()"
        >
            📤 Upload Video
        </button>

    </div>

    <div class="card">

        <h3>📺 Uploaded Videos (${videos.length})</h3>

        <input
            id="search-video"
            class="full-width"
            placeholder="🔍 Search Videos"
            onkeyup="filterVideos()"
        >

        <br><br>

        ${videos.length === 0
      ? "<p>No videos uploaded.</p>"
      : videos.map(video => `
                <div
                    class="ledger-row video-card"
                    data-title="${video.title.toLowerCase()}"
                    data-subject="${video.subject_name.toLowerCase()}"
                >

                    <div>

                        <strong>${video.title}</strong><br>

                        ${video.subject_name} - ${video.batch_name}<br>

                        <small>${video.video_type}</small>

                    </div>

                    <div style="display:flex;gap:8px;">

                        <a
                            href="${video.video_url}"
                            target="_blank"
                            class="btn secondary"
                        >
                            ▶ Watch
                        </a>

                        <button
                            class="btn warning"
                            onclick="editVideo(${video.video_id})"
                        >
                            ✏ Edit
                        </button>

                        <button
                            class="btn danger"
                            onclick="removeVideo(${video.video_id})"
                        >
                            🗑 Delete
                        </button>

                    </div>

                </div>
            `).join("")
    }

    </div>

</div>

`;

}
// async function teacher_analytics() {

//     setTitle("Generate Tests", "Coming Soon");

//     return `
//         <div class="card">
//             <h3>Generate Tests</h3>
//             <p>This module will be connected to the database next.</p>
//         </div>
//     `;

// }

/* ================= CLEANED UP END OF FILE ================= */

// This function performs the API call


// This function is what the UI calls
async function removeNote(noteId) {
  if (!confirm("Delete this note?")) {
    return;
  }
  try {
    const result = await apiDeleteNote(noteId);
    showToast(result.message);
    await renderSection();
  } catch (err) {
    showToast(err.message);
  }
}

async function deleteNote(noteId) {
    if (!confirm("Delete this note?")) return;
    try {
        const result = await apiRequest(`/notes/${noteId}`, "DELETE");
        showToast(result.message);
        await renderSection();
    } catch (err) {
        showToast(err.message);
    }
}


async function renderAttendance() {
    const response = await fetch("/api/parent/attendance", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    const result = await response.json();
    
    if (result.success) {
        let tableRows = result.data.map(row => `
            <tr>
                <td>${row.attendance_date}</td>
                <td><span class="badge ${row.status.toLowerCase()}">${row.status}</span></td>
            </tr>
        `).join("");

        mainContent.innerHTML = `
            <h2>Live Attendance History</h2>
            <table class="table">
                <thead><tr><th>Date</th><th>Status</th></tr></thead>
                <tbody>${tableRows}</tbody>
            </table>
        `;
    }
}
function pillFor(status) {
    const color = status === 'Present' ? 'var(--good)' : 'var(--bad)';
    return `<span style="padding:4px 8px; border-radius:12px; background:${color}20; color:${color}; font-size:12px;">${status}</span>`;
}

function renderAdminUserForm() {
    return `
    <div class="card">
        <h3>Create New User (Student/Teacher)</h3>
        <form id="adminCreateUserForm" onsubmit="handleCreateUser(event)">
            <div class="field"><label>Full Name</label><input type="text" id="add_name" required></div>
            <div class="field"><label>Phone</label><input type="text" id="add_phone" required></div>
            <div class="field"><label>Role</label>
                <select id="add_role">
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                </select>
            </div>
            <div class="field"><label>Temporary Password</label><input type="password" id="add_password" required></div>
            <button type="submit" class="btn-primary">Create User</button>
        </form>
    </div>`;
}

// 1. Locate handleCreateUser and add the refresh call:
async function handleCreateUser(e) {
    e.preventDefault();
    const userData = {
        full_name: document.getElementById('add_name').value,
        phone: document.getElementById('add_phone').value,
        password: document.getElementById('add_password').value,
        role: document.getElementById('add_role').value
    };

    const res = await fetch(`${API_URL}/admin/create-user`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(userData)
    });
    const result = await res.json();
    if (result.success) {
        alert("User added securely!");
        // --- ADD THIS LINE TO REFRESH THE TEACHER LIST ---
        if (state.section === 'teachers') {
             await admin_teachers(); // Re-render the teacher list
        }
    } else {
        alert("Error: " + result.message);
    }
  }

async function editTeacher(teacherId) {
    // 1. Fetch the data (ensure your API returns joined user+teacher data)
    const response = await apiRequest(`/teachers/${teacherId}`);
    const t = response.teacher;

    // 2. Inject Modal into DOM
    document.getElementById("content").innerHTML += `
    <div class="modal" id="editModal">
        <div class="modal-box">
            <h3>Edit Teacher Profile</h3>
            <div class="grid g2">
                <input id="e_name" value="${t.full_name}">
                <input id="e_email" value="${t.email || ''}">
                <input id="e_phone" value="${t.phone || ''}">
                <input id="e_qual" value="${t.qualification}">
                <input id="e_exp" value="${t.experience}">
                <input id="e_salary" value="${t.salary}">
            </div>
            
            <button class="btn primary" onclick="submitEditTeacher(${teacherId})">Save Changes</button>
            <button class="btn secondary" onclick="document.getElementById('editModal').remove()">Cancel</button>
        </div>
    </div>`;
}

async function submitEditTeacher(teacherId) {
    const updatedData = {
        full_name: document.getElementById('e_name').value,
        email: document.getElementById('e_email').value,
        phone: document.getElementById('e_phone').value,
        qualification: document.getElementById('e_qual').value,
        salary: document.getElementById('e_salary').value
    };

    try {
        await apiRequest(`/teachers/${teacherId}`, "PUT", updatedData);
        showToast("Teacher updated successfully!");
        closeModal();
        await renderSection(); // Refresh the list
    } catch (err) {
        showToast("Update failed: " + err.message);
    }
}

function closeModal() {
    const modal = document.getElementById('editTeacherModal');
    if (modal) modal.remove();
}

function buildNav() {
  const navEl = document.getElementById("nav-group");
  navEl.innerHTML = "";
  
  NAV[state.role].forEach(([key, icon, label]) => {
    const item = document.createElement("div");
    item.className = "nav-item" + (key === state.section ? " active" : "");
    item.innerHTML = `<span class="ic">${icon}</span><span>${label}</span>`;
    
    item.onclick = async () => {
      state.section = key;
      buildNav(); // Re-render nav first
      
      // Use the renderers object to call your functions
      await renderSection(); 
    };
    navEl.appendChild(item);
  });
}

// Find this function in script.js
async function renderAskDoubtsPage() {
    setTitle("Ask Doubts", "Post your question to the teacher");
    
    // CHANGE THIS: Update the HTML template to remove AI branding
    document.getElementById("content").innerHTML = `
        <div class="card">
            <h3>Ask a Doubt</h3>
            <p>Type your question below to send it to your teacher.</p>
            <textarea id="student-doubt-text" class="full-width" rows="4" placeholder="e.g., Explain the segment selector in 8051?"></textarea>
            <button class="btn primary" style="margin-top:10px;" onclick="postHumanDoubt()">Post Doubt</button>
        </div>
        <div id="doubt-list" style="margin-top:20px;"></div>
    `;
    
    // Load existing doubts
    loadDoubts();
}

async function processDoubt() {
    const question = document.getElementById('ai-question').value;
    const responseBox = document.getElementById('ai-response-box');
    const responseText = document.getElementById('ai-response-text');

    if (!question.trim()) return showToast("Please enter a question!");

    responseBox.style.display = 'block';
    responseText.innerText = "Analyzing institute knowledge base...";

    try {
        const response = await fetch(`${API_URL}/doubts/ask`, { // Added 's' to doubt
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ question })
});

        const data = await response.json();
        
        if (data.success) {
            responseText.innerText = data.answer;
        } else {
            responseText.innerText = "Error: " + (data.message || "Could not resolve doubt.");
        }
    } catch (err) {
        responseText.innerText = "Connection error. Ensure the backend is running.";
    }
}