

/* ================= DATA ================= */
const ROLE_META = {
  student:{label:"Student Portal", name:"Aarav Sharma", sub:"Class 12 · Batch IIT-A", initial:"A"},
  parent:{label:"Parent Portal", name:"Mr. Rakesh Sharma", sub:"Parent of Aarav Sharma", initial:"R"},
  teacher:{label:"Teacher Portal", name:"Ms. Priya Mehta", sub:"Physics · 4 batches", initial:"P"},
  admin:{label:"Admin Panel", name:"Front Office", sub:"Vertex Academy, Kota", initial:"F"},
};

const NAV = {
  student:[
    ["dashboard","🏠","Dashboard"],["timetable","🗓️","Timetable"],["attendance","✅","Attendance"],
    ["homework","📝","Homework"],["notes","📒","Daily Notes"],["lectures","🎥","Recorded Lectures"],
    ["tests","🧪","Tests"],["results","📊","Test Results"],["fees","💳","Fees Status"],
    ["doubts","💬","Ask Doubts"],["aichat","✨","AI Chat"],
  ],
  parent:[
    ["dashboard","🏠","Dashboard"],["liveattendance","✅","Live Attendance"],["fees","💳","Fees"],
    ["performance","📈","Performance"],["homeworkstatus","📝","Homework Status"],["remarks","🗒️","Teacher Remarks"],
    ["monthly","📰","Monthly Report"],["exams","🧪","Upcoming Exams"],["notice","📌","Notice Board"],["chat","💬","Chat with Teachers"],
  ],
  teacher:[
    ["dashboard","🏠","Dashboard"],["markattendance","✅","Mark Attendance"],["uploadhomework","📝","Upload Homework"],
    ["uploadnotes","📒","Upload Notes"],["uploadvideos","🎥","Upload Videos"],["generatetests","🧪","Generate Tests"],
    ["checkhomework","🗂️","Check Homework"],["replydoubts","💬","Reply Doubts"],["analytics","📊","View Analytics"],["messageparents","✉️","Message Parents"],
  ],
  admin:[
    ["dashboard","🏠","Dashboard"],["admissions","🧾","Admissions"],["feecollection","💳","Fee Collection"],
    ["teachers","🧑‍🏫","Add Teachers"],["classes","🏷️","Create Classes"],["batches","👥","Create Batches"],
    ["students","🎓","Manage Students"],["notices","📌","Upload Notices"],["reports","📑","Reports"],["analytics","📊","Analytics"],
  ],
};

let state = { role:"student", section:"dashboard" };
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

renderSection();

loadDashboardStats();

showToast("Welcome " + result.user.name);

} catch (error) {

    showToast(error.message);

}

}

function doLogout(){

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    document.getElementById("app-screen").style.display="none";

    document.getElementById("login-screen").style.display="flex";

    showToast("Logged Out");

}

async function loadDashboardStats() {

    try {

        const result = await apiRequest("/dashboard/stats");

        const stats = result.stats;

        document.getElementById("studentCount").textContent =
            stats.students;

        document.getElementById("teacherCount").textContent =
            stats.teachers;

        document.getElementById("parentCount").textContent =
            stats.parents;

        document.getElementById("admissionCount").textContent =
            stats.admissions;

    }

    catch(err){

        console.error(err);

        showToast("Unable to load dashboard");

    }

}

function buildNav(){
  const navEl = document.getElementById("nav-group");
  navEl.innerHTML = "";
  NAV[state.role].forEach(([key,icon,label])=>{
    const item = document.createElement("div");
    item.className = "nav-item" + (key===state.section ? " active" : "");
    item.innerHTML = `<span class="ic">${icon}</span><span>${label}</span>`;
    item.onclick = ()=>{ state.section = key; buildNav(); renderSection(); };
    navEl.appendChild(item);
  });
}

function toggleNotif(){
  document.getElementById("notif-dropdown").classList.toggle("show");
}
document.addEventListener("click",(e)=>{
  if(!e.target.closest(".bell") && !e.target.closest(".notif-dropdown")){
    document.getElementById("notif-dropdown").classList.remove("show");
  }
});

function showToast(msg){
  const t = document.getElementById("toast");
  document.getElementById("toast-text").textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 2200);
}

/* ================= MOCK DATA ================= */
const timetable = [
  {time:"7:30 – 9:00", subj:"Physics", teacher:"P. Mehta", room:"Hall 3"},
  {time:"9:15 – 10:45", subj:"Chemistry", teacher:"S. Rao", room:"Hall 1"},
  {time:"11:00 – 12:30", subj:"Mathematics", teacher:"A. Kulkarni", room:"Hall 2"},
  {time:"1:30 – 2:30", subj:"Doubt Clinic", teacher:"Rotating Faculty", room:"Lab 2"},
  {time:"3:00 – 4:30", subj:"Test Practice", teacher:"—", room:"Hall 3"},
];
const attendanceData = [
  {date:"Jun 29", status:"Present"}, {date:"Jun 27", status:"Present"}, {date:"Jun 26", status:"Absent"},
  {date:"Jun 25", status:"Present"}, {date:"Jun 24", status:"Present"}, {date:"Jun 23", status:"Late"},
];
const homeworkData = [
  {subj:"Physics", title:"Rotational Dynamics — Q1 to Q12", due:"Jul 1", status:"Pending"},
  {subj:"Chemistry", title:"Organic Ch. 9 — Reaction mechanisms", due:"Jun 30", status:"Submitted"},
  {subj:"Mathematics", title:"Definite Integrals — Worksheet 6", due:"Jun 28", status:"Checked"},
  {subj:"Physics", title:"Numerical Set — Thermodynamics", due:"Jun 26", status:"Checked"},
];
const lecturesData = [
  {subj:"Physics", title:"Rotational Motion — Part 2", dur:"58 min", date:"Jun 28"},
  {subj:"Chemistry", title:"Aldehydes & Ketones — Intro", dur:"46 min", date:"Jun 27"},
  {subj:"Mathematics", title:"Integration by Parts", dur:"52 min", date:"Jun 25"},
];
const testsData = [
  {name:"Physics Unit Test 4", date:"Jul 3", syllabus:"Rotational Dynamics", status:"Upcoming"},
  {name:"Full Syllabus Test 2", date:"Jul 12", syllabus:"All subjects", status:"Upcoming"},
  {name:"Chemistry Unit Test 3", date:"Jun 24", syllabus:"Organic Basics", status:"Result out"},
];
const resultsData = [
  {name:"Chemistry Unit Test 3", score:"82 / 100", percentile:"91.4", rank:"14 / 240"},
  {name:"Mathematics Unit Test 3", score:"76 / 100", percentile:"86.2", rank:"31 / 240"},
  {name:"Full Syllabus Test 1", score:"612 / 720", percentile:"94.8", rank:"9 / 240"},
];
const feesData = {
  total:185000, paid:135000,
  installments:[
    {name:"Installment 1", amount:45000, due:"Apr 10", status:"Paid"},
    {name:"Installment 2", amount:45000, due:"May 10", status:"Paid"},
    {name:"Installment 3", amount:45000, due:"Jul 5", status:"Due"},
    {name:"Installment 4", amount:50000, due:"Sep 10", status:"Upcoming"},
  ]
};
const doubtsData = [
  {q:"In rotational motion, why does torque depend on the angle of the applied force?", subj:"Physics", status:"Answered", from:"You"},
  {q:"Can someone explain SN1 vs SN2 mechanism with a simple example?", subj:"Chemistry", status:"Pending", from:"You"},
];
const remarksData = [
  {teacher:"P. Mehta (Physics)", note:"Aarav is improving in numericals but needs to revise rotational dynamics theory.", date:"Jun 26"},
  {teacher:"A. Kulkarni (Maths)", note:"Strong in calculus, should practice more on probability.", date:"Jun 20"},
];
const noticeData = [
  {title:"Parent–Teacher meet on Jul 6", body:"All parents of Batch IIT-A are requested to attend.", date:"Jun 29"},
  {title:"Holiday on Jul 2 — local festival", body:"Academy will remain closed. Classes resume Jul 3.", date:"Jun 27"},
  {title:"New library timings", body:"Library now open till 8 PM on weekdays.", date:"Jun 24"},
];
const teacherStudents = [
  {name:"Aarav Sharma", roll:"IITA-014", attendance:"96%", lastScore:"82%"},
  {name:"Diya Patel", roll:"IITA-015", attendance:"91%", lastScore:"74%"},
  {name:"Kabir Singh", roll:"IITA-016", attendance:"88%", lastScore:"69%"},
  {name:"Meera Iyer", roll:"IITA-017", attendance:"99%", lastScore:"90%"},
  {name:"Yusuf Khan", roll:"IITA-018", attendance:"79%", lastScore:"58%"},
];
const admissionsData = [
  {name:"Tanvi Joshi", batch:"NEET-B", date:"Jun 29", status:"New"},
  {name:"Rohan Verma", batch:"IIT-A", date:"Jun 28", status:"New"},
  {name:"Sara Khan", batch:"Foundation-C", date:"Jun 26", status:"Confirmed"},
];
const studentsList = [
  {name:"Aarav Sharma", class:"12", batch:"IIT-A", fee:"Paid", attendance:"96%"},
  {name:"Diya Patel", class:"12", batch:"IIT-A", fee:"Due", attendance:"91%"},
  {name:"Kabir Singh", class:"11", batch:"NEET-B", fee:"Paid", attendance:"88%"},
  {name:"Meera Iyer", class:"11", batch:"Foundation-C", fee:"Paid", attendance:"99%"},
];

/* ================= RENDER HELPERS ================= */
function pillFor(status){
  const map = {Present:"good", Checked:"good", Submitted:"info", Pending:"bad", Absent:"bad", Late:"accent",
    "Result out":"good", Upcoming:"info", Paid:"good", Due:"bad", New:"accent", Confirmed:"good", Answered:"good"};
  return `<span class="pill ${map[status]||'info'}">${status}</span>`;
}

function setTitle(t,c){
  document.getElementById("page-title").textContent = t;
  document.getElementById("page-crumb").textContent = c;
}

/* ================= SECTION RENDERERS ================= */
const renderers = {

/* ---- STUDENT ---- */
student_dashboard(){
  setTitle("Dashboard","Welcome back, Aarav — here's today at a glance");
  return `
  <div class="grid g4" style="margin-bottom:18px;">
    <div class="card stat-card"><div class="lbl">Attendance (month)</div><div class="val">96%</div><div class="delta up">▲ 2% vs last month</div></div>
    <div class="card stat-card"><div class="lbl">Pending homework</div><div class="val">1</div><div class="delta down">Due tomorrow</div></div>
    <div class="card stat-card"><div class="lbl">Last test score</div><div class="val">82%</div><div class="delta up">Rank 14 / 240</div></div>
    <div class="card stat-card"><div class="lbl">Fees due</div><div class="val">₹45,000</div><div class="delta down">Due Jul 5</div></div>
  </div>
  <div class="grid g2">
    <div class="card"><h3>Today's Timetable</h3>${timetable.slice(0,4).map(t=>`
      <div class="ledger-row"><div class="left"><span class="tag">${t.time}</span><strong>${t.subj}</strong></div><span style="color:var(--ink-soft); font-size:12.5px;">${t.room}</span></div>`).join("")}
    </div>
    <div class="card"><h3>Recent Activity</h3>
      <div class="timeline-item"><div class="t-dot">✓</div><div class="t-body"><strong>Chemistry homework submitted</strong><span>Jun 28 · Organic Ch. 9</span></div></div>
      <div class="timeline-item"><div class="t-dot">★</div><div class="t-body"><strong>Chemistry Unit Test 3 result published</strong><span>Jun 26 · Scored 82/100</span></div></div>
      <div class="timeline-item"><div class="t-dot">!</div><div class="t-body"><strong>Marked absent — Physics</strong><span>Jun 26</span></div></div>
      <div class="timeline-item"><div class="t-dot">📒</div><div class="t-body"><strong>New daily notes uploaded</strong><span>Jun 25 · Rotational Motion</span></div></div>
    </div>
  </div>`;
},
student_timetable(){
  setTitle("Timetable","Your weekly class schedule");
  return `<div class="card"><h3>Monday, Jun 30</h3><table><thead><tr><th>Time</th><th>Subject</th><th>Faculty</th><th>Room</th></tr></thead><tbody>
    ${timetable.map(t=>`<tr><td class="mono">${t.time}</td><td><strong>${t.subj}</strong></td><td>${t.teacher}</td><td>${t.room}</td></tr>`).join("")}
  </tbody></table></div>`;
},
student_attendance(){
  setTitle("Attendance","96% present this month — keep it up");
  return `<div class="grid g3" style="margin-bottom:18px;">
    <div class="card stat-card"><div class="lbl">This month</div><div class="val">96%</div></div>
    <div class="card stat-card"><div class="lbl">This term</div><div class="val">93%</div></div>
    <div class="card stat-card"><div class="lbl">Classes missed</div><div class="val">3</div></div>
  </div>
  <div class="card"><h3>Recent log</h3>${attendanceData.map(a=>`
    <div class="ledger-row"><span>${a.date}</span>${pillFor(a.status)}</div>`).join("")}</div>`;
},
student_homework(){
  setTitle("Homework","Assignments across all subjects");
  return `<div class="card"><table><thead><tr><th>Subject</th><th>Title</th><th>Due</th><th>Status</th></tr></thead><tbody>
    ${homeworkData.map(h=>`<tr><td>${h.subj}</td><td>${h.title}</td><td class="mono">${h.due}</td><td>${pillFor(h.status)}</td></tr>`).join("")}
  </tbody></table></div>`;
},
student_notes(){
  setTitle("Daily Notes","Notes uploaded by your teachers");
  return `<div class="grid g3">
    ${["Rotational Motion — Summary","Organic Reaction Map","Integration Formula Sheet","Thermodynamics Quick Notes","Periodic Trends Cheatsheet","Probability Shortcuts"].map((t,i)=>`
    <div class="card"><div style="font-size:22px;">📒</div><h3 style="margin-top:10px;">${t}</h3><div style="font-size:12.5px; color:var(--ink-soft); margin-bottom:14px;">Uploaded Jun ${28-i} · PDF</div><button class="btn-sm" onclick="showToast('Downloading note…')">Download</button></div>`).join("")}
  </div>`;
},
student_lectures(){
  setTitle("Recorded Lectures","Catch up on any class you missed");
  return `<div class="grid g3">${lecturesData.map(l=>`
    <div class="card"><div style="height:110px; border-radius:10px; background:linear-gradient(135deg,#15182A,#3457A6); display:flex; align-items:center; justify-content:center; color:#fff; font-size:26px; margin-bottom:12px;">▶</div>
    <strong>${l.title}</strong><div style="font-size:12.5px; color:var(--ink-soft); margin-top:4px;">${l.subj} · ${l.dur} · ${l.date}</div>
    <button class="btn-sm solid" style="margin-top:12px;" onclick="showToast('Playing lecture…')">Watch</button></div>`).join("")}</div>`;
},
student_tests(){
  setTitle("Tests","Upcoming and recent assessments");
  return `<div class="card"><table><thead><tr><th>Test</th><th>Syllabus</th><th>Date</th><th>Status</th></tr></thead><tbody>
    ${testsData.map(t=>`<tr><td><strong>${t.name}</strong></td><td>${t.syllabus}</td><td class="mono">${t.date}</td><td>${pillFor(t.status)}</td></tr>`).join("")}
  </tbody></table></div>`;
},
student_results(){
  setTitle("Test Results","Your scores, percentile and rank");
  return `<div class="card"><table><thead><tr><th>Test</th><th>Score</th><th>Percentile</th><th>Rank</th></tr></thead><tbody>
    ${resultsData.map(r=>`<tr><td><strong>${r.name}</strong></td><td class="mono">${r.score}</td><td class="mono">${r.percentile}</td><td class="mono">${r.rank}</td></tr>`).join("")}
  </tbody></table></div>`;
},
student_fees(){
  setTitle("Fees Status","Track installments and dues");
  const pct = Math.round(feesData.paid/feesData.total*100);
  return `<div class="card" style="margin-bottom:18px;">
    <h3>₹${feesData.paid.toLocaleString()} paid of ₹${feesData.total.toLocaleString()}</h3>
    <div class="bar-bg" style="margin-top:10px;"><div class="bar-fill good" style="width:${pct}%"></div></div>
    <div style="font-size:12.5px; color:var(--ink-soft); margin-top:8px;">${pct}% of total fees cleared</div>
  </div>
  <div class="card">${feesData.installments.map(f=>`
    <div class="ledger-row"><div class="left"><strong>${f.name}</strong><span class="tag">Due ${f.due}</span></div>
    <div style="display:flex; align-items:center; gap:12px;"><span class="mono">₹${f.amount.toLocaleString()}</span>${pillFor(f.status)}</div></div>`).join("")}</div>`;
},
student_doubts(){
  setTitle("Ask Doubts","Post a question, get help from faculty");
  return `<div class="card" style="margin-bottom:18px;">
    <h3>Post a new doubt</h3>
    <textarea placeholder="Type your doubt here…" style="width:100%; min-height:80px; border:1.5px solid var(--line); border-radius:10px; padding:12px; font-size:13.5px; font-family:inherit;"></textarea>
    <button class="btn-sm solid" style="margin-top:10px;" onclick="showToast('Doubt posted to faculty')">Post doubt</button>
  </div>
  <div class="card"><h3>Your doubts</h3>${doubtsData.map(d=>`
    <div class="ledger-row"><div class="left"><strong style="max-width:420px;">${d.q}</strong></div>${pillFor(d.status)}</div>`).join("")}</div>`;
},
student_aichat(){
  setTitle("AI Chat","Coming soon");
  return `<div class="card empty"><div class="ic">✨</div><h3>AI Chat arrives in Phase 2</h3><p style="margin-top:6px; font-size:13.5px;">This is reserved space for the AI doubt-solving assistant — not part of Phase 1.</p></div>`;
},

/* ---- PARENT ---- */
parent_dashboard(){
  setTitle("Dashboard","Aarav's progress at a glance");
  return `<div class="grid g4" style="margin-bottom:18px;">
    <div class="card stat-card"><div class="lbl">Attendance</div><div class="val">96%</div><div class="delta up">On track</div></div>
    <div class="card stat-card"><div class="lbl">Last test</div><div class="val">82%</div><div class="delta up">Rank 14/240</div></div>
    <div class="card stat-card"><div class="lbl">Fees due</div><div class="val">₹45,000</div><div class="delta down">Due Jul 5</div></div>
    <div class="card stat-card"><div class="lbl">Pending homework</div><div class="val">1</div><div class="delta down">Chemistry</div></div>
  </div>
  <div class="grid g2">
    <div class="card"><h3>Latest Teacher Remark</h3>
      <p style="font-size:13.5px; line-height:1.6;">"${remarksData[0].note}"</p>
      <div style="font-size:12px; color:var(--ink-soft); margin-top:10px;">— ${remarksData[0].teacher}, ${remarksData[0].date}</div>
    </div>
    <div class="card"><h3>Notice Board</h3>${noticeData.slice(0,3).map(n=>`
      <div class="ledger-row"><div class="left"><strong>${n.title}</strong></div><span class="tag">${n.date}</span></div>`).join("")}</div>
  </div>`;
},
parent_liveattendance(){
  setTitle("Live Attendance","Real-time presence today");
  return `<div class="card" style="margin-bottom:18px; display:flex; align-items:center; gap:16px;">
    <div style="width:54px; height:54px; border-radius:50%; background:var(--good-bg); color:var(--good); display:flex; align-items:center; justify-content:center; font-size:22px;">✓</div>
    <div><strong style="font-size:16px;">Checked in at 7:28 AM</strong><div style="font-size:12.5px; color:var(--ink-soft);">Physics class, Hall 3 — Vertex Academy</div></div>
  </div>
  <div class="card"><h3>This week</h3>${attendanceData.map(a=>`<div class="ledger-row"><span>${a.date}</span>${pillFor(a.status)}</div>`).join("")}</div>`;
},
parent_fees(){return renderers.student_fees();},
parent_performance(){
  setTitle("Performance","Trend across recent tests");
  return `<div class="card" style="margin-bottom:18px;"><h3>Score trend</h3>
    <div style="display:flex; align-items:flex-end; gap:16px; height:160px; padding-top:10px;">
    ${[58,64,71,76,82].map((v,i)=>`<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px;">
      <div style="width:100%; background:var(--accent); border-radius:6px 6px 0 0; height:${v}px;"></div>
      <span style="font-size:11px; color:var(--ink-soft);">T${i+1}</span></div>`).join("")}
    </div></div>
    <div class="card"><table><thead><tr><th>Test</th><th>Score</th><th>Percentile</th><th>Rank</th></tr></thead><tbody>
    ${resultsData.map(r=>`<tr><td><strong>${r.name}</strong></td><td class="mono">${r.score}</td><td class="mono">${r.percentile}</td><td class="mono">${r.rank}</td></tr>`).join("")}
    </tbody></table></div>`;
},
parent_homeworkstatus(){
  setTitle("Homework Status","What's pending vs completed");
  return renderers.student_homework();
},
parent_remarks(){
  setTitle("Teacher Remarks","Faculty notes on your child");
  return `<div class="card">${remarksData.map(r=>`
    <div class="ledger-row" style="align-items:flex-start;"><div class="left" style="flex-direction:column; align-items:flex-start; gap:4px;"><strong>${r.teacher}</strong><span style="font-size:13px; color:var(--ink-soft); max-width:480px;">${r.note}</span></div><span class="tag">${r.date}</span></div>`).join("")}</div>`;
},
parent_monthly(){
  setTitle("Monthly Report","June 2026 summary");
  return `<div class="grid g3" style="margin-bottom:18px;">
    <div class="card stat-card"><div class="lbl">Avg attendance</div><div class="val">93%</div></div>
    <div class="card stat-card"><div class="lbl">Avg test score</div><div class="val">79%</div></div>
    <div class="card stat-card"><div class="lbl">Homework completed</div><div class="val">11/12</div></div>
  </div>
  <div class="card"><h3>Faculty summary</h3><p style="font-size:13.5px; line-height:1.7;">Aarav has shown consistent improvement in Mathematics and Chemistry this month. Physics numericals need more practice ahead of the upcoming unit test. Overall attendance and discipline remain strong.</p>
  <button class="btn-sm solid" style="margin-top:14px;" onclick="showToast('Downloading report PDF…')">Download full report</button></div>`;
},
parent_exams(){
  setTitle("Upcoming Exams","What's scheduled next");
  return `<div class="card">${testsData.filter(t=>t.status==="Upcoming").map(t=>`
    <div class="ledger-row"><div class="left"><strong>${t.name}</strong><span class="tag">${t.syllabus}</span></div><span class="mono">${t.date}</span></div>`).join("")}</div>`;
},
parent_notice(){
  setTitle("Notice Board","Updates from the academy");
  return `<div class="grid g2">${noticeData.map(n=>`<div class="card"><strong>${n.title}</strong><p style="font-size:13px; color:var(--ink-soft); margin-top:8px;">${n.body}</p><div style="font-size:11.5px; color:var(--ink-soft); margin-top:10px;">${n.date}</div></div>`).join("")}</div>`;
},
parent_chat(){return chatUI("Ms. Priya Mehta (Physics)",[
  {who:"in", text:"Aarav did well in today's practice test, just needs to revise the formula sheet.", t:"9:40 AM"},
  {who:"out", text:"Thank you for the update! Will make sure he revises tonight.", t:"9:52 AM"},
]);},

/* ---- TEACHER ---- */
teacher_dashboard(){
  setTitle("Dashboard","Your classes and pending actions");
  return `<div class="grid g4" style="margin-bottom:18px;">
    <div class="card stat-card"><div class="lbl">Classes today</div><div class="val">3</div></div>
    <div class="card stat-card"><div class="lbl">Homework to check</div><div class="val">18</div></div>
    <div class="card stat-card"><div class="lbl">Doubts pending</div><div class="val">5</div></div>
    <div class="card stat-card"><div class="lbl">Avg batch attendance</div><div class="val">91%</div></div>
  </div>
  <div class="grid g2">
    <div class="card"><h3>Today's Schedule</h3>${timetable.slice(0,3).map(t=>`<div class="ledger-row"><div class="left"><span class="tag">${t.time}</span><strong>${t.subj}</strong></div><span style="font-size:12.5px; color:var(--ink-soft);">${t.room}</span></div>`).join("")}</div>
    <div class="card"><h3>Recent doubt requests</h3>${doubtsData.map(d=>`<div class="ledger-row"><div class="left"><strong style="max-width:380px;">${d.q}</strong></div>${pillFor(d.status)}</div>`).join("")}</div>
  </div>`;
},
teacher_markattendance(){
  setTitle("Mark Attendance","Batch IIT-A · Physics · Jun 30");
  return `<div class="card"><table><thead><tr><th>Roll</th><th>Student</th><th>Status</th></tr></thead><tbody>
    ${teacherStudents.map(s=>`<tr><td class="mono">${s.roll}</td><td>${s.name}</td><td>
      <select class="input-like"><option>Present</option><option>Absent</option><option>Late</option></select></td></tr>`).join("")}
    </tbody></table>
    <button class="btn-sm solid" style="margin-top:16px;" onclick="showToast('Attendance saved for Batch IIT-A')">Save attendance</button></div>`;
},
teacher_uploadhomework(){
  setTitle("Upload Homework","Assign work to a batch");
  return uploadForm("homework", "e.g. Rotational Dynamics — Q1 to Q12");
},
teacher_uploadnotes(){
  setTitle("Upload Notes","Share daily notes with a batch");
  return uploadForm("notes", "e.g. Rotational Motion — Summary Notes");
},
teacher_uploadvideos(){
  setTitle("Upload Videos","Publish a recorded lecture");
  return uploadForm("video", "e.g. Rotational Motion — Part 3");
},
teacher_generatetests(){
  setTitle("Generate Tests","Create a new test for your batch");
  return `<div class="card g2 grid">
    <div class="field"><label>Test name</label><input placeholder="Physics Unit Test 5"></div>
    <div class="field"><label>Batch</label><select class="input-like" style="width:100%;"><option>IIT-A</option><option>NEET-B</option><option>Foundation-C</option></select></div>
    <div class="field"><label>Syllabus</label><input placeholder="Rotational Dynamics, Gravitation"></div>
    <div class="field"><label>Date</label><input type="date"></div>
    <div class="field"><label>Total marks</label><input type="number" placeholder="100"></div>
    <div class="field"><label>Duration (min)</label><input type="number" placeholder="90"></div>
  </div>
  <button class="btn-sm solid" onclick="showToast('Test created and scheduled')">Create test</button>
  <div class="card" style="margin-top:18px;"><h3>Existing tests</h3>${testsData.map(t=>`<div class="ledger-row"><div class="left"><strong>${t.name}</strong><span class="tag">${t.syllabus}</span></div><span class="mono">${t.date}</span></div>`).join("")}</div>`;
},
teacher_checkhomework(){
  setTitle("Check Homework","Review and grade submissions");
  return `<div class="card"><table><thead><tr><th>Student</th><th>Assignment</th><th>Submitted</th><th>Action</th></tr></thead><tbody>
    ${teacherStudents.map((s,i)=>`<tr><td>${s.name}</td><td>Organic Ch. 9 Worksheet</td><td class="mono">${["Jun 29","Jun 29","Jun 28","Jun 28","—"][i]}</td>
    <td>${i<4?'<button class="btn-sm solid" onclick="showToast(\'Marked checked\')">Mark checked</button>':pillFor("Pending")}</td></tr>`).join("")}
    </tbody></table></div>`;
},
teacher_replydoubts(){
  setTitle("Reply Doubts","Help students with their questions");
  return `<div class="card">${doubtsData.map(d=>`
    <div class="ledger-row" style="align-items:flex-start;"><div class="left" style="flex-direction:column; align-items:flex-start; gap:6px;">
    <strong style="max-width:480px;">${d.q}</strong><span class="tag">${d.subj} · ${d.from}</span></div>
    ${d.status==="Pending"?`<button class="btn-sm solid" onclick="showToast('Reply sent')">Reply</button>`:pillFor("Answered")}</div>`).join("")}</div>`;
},
teacher_analytics(){
  setTitle("View Analytics","Batch IIT-A performance overview");
  return `<div class="card" style="margin-bottom:18px;"><h3>Average score by test</h3>
    <div style="display:flex; align-items:flex-end; gap:16px; height:160px; padding-top:10px;">
    ${[68,72,70,75,79].map((v,i)=>`<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px;"><div style="width:100%; background:var(--info); border-radius:6px 6px 0 0; height:${v}px;"></div><span style="font-size:11px; color:var(--ink-soft);">T${i+1}</span></div>`).join("")}
    </div></div>
    <div class="card"><h3>Student snapshot</h3><table><thead><tr><th>Student</th><th>Attendance</th><th>Last Score</th></tr></thead><tbody>
    ${teacherStudents.map(s=>`<tr><td>${s.name}</td><td class="mono">${s.attendance}</td><td class="mono">${s.lastScore}</td></tr>`).join("")}
    </tbody></table></div>`;
},
teacher_messageparents(){return chatUI("Mr. Rakesh Sharma (Aarav's parent)",[
  {who:"out", text:"Aarav did well in today's practice test, just needs to revise the formula sheet.", t:"9:40 AM"},
  {who:"in", text:"Thank you for the update! Will make sure he revises tonight.", t:"9:52 AM"},
]);},

/* ---- ADMIN ---- */
admin_dashboard(){
  setTitle("Dashboard","Academy-wide snapshot");
  return `<div class="grid g4" style="margin-bottom:18px;">
    <div class="card stat-card"><div class="lbl">Total students</div><div class="val">2,340</div><div class="delta up">▲ 18 this week</div></div>
    <div class="card stat-card"><div class="lbl">Fee collected (Jun)</div><div class="val">₹68.4L</div><div class="delta up">92% of target</div></div>
    <div class="card stat-card"><div class="lbl">Teachers</div><div class="val">86</div></div>
    <div class="card stat-card"><div class="lbl">Avg attendance</div><div class="val">94%</div><div class="delta up">▲ 1.2%</div></div>
  </div>
  <div class="grid g2">
    <div class="card"><h3>Recent Admissions</h3>${admissionsData.map(a=>`<div class="ledger-row"><div class="left"><strong>${a.name}</strong><span class="tag">${a.batch}</span></div>${pillFor(a.status)}</div>`).join("")}</div>
    <div class="card"><h3>Fee Collection Status</h3>
      <div class="bar-bg"><div class="bar-fill good" style="width:73%"></div></div>
      <div style="font-size:12.5px; color:var(--ink-soft); margin-top:8px; margin-bottom:14px;">₹68.4L collected of ₹93.6L expected for June</div>
      ${["IIT-A","NEET-B","Foundation-C"].map((b,i)=>`<div class="ledger-row"><span>${b}</span><span class="mono">${[88,76,69][i]}% collected</span></div>`).join("")}
    </div>
  </div>`;
},
admin_admissions(){
  setTitle("Admissions","New enquiries and confirmations");
  return `<div class="card" style="margin-bottom:18px;"><h3>New admission</h3>
    <div class="grid g3">
      <div class="field"><label>Student name</label><input placeholder="Full name"></div>
      <div class="field"><label>Class</label><select class="input-like" style="width:100%;"><option>11</option><option>12</option></select></div>
      <div class="field"><label>Batch</label><select class="input-like" style="width:100%;"><option>IIT-A</option><option>NEET-B</option><option>Foundation-C</option></select></div>
    </div>
    <button class="btn-sm solid" onclick="showToast('Admission record created')">Add student</button></div>
  <div class="card"><table><thead><tr><th>Name</th><th>Batch</th><th>Date</th><th>Status</th></tr></thead><tbody>
    ${admissionsData.map(a=>`<tr><td>${a.name}</td><td>${a.batch}</td><td class="mono">${a.date}</td><td>${pillFor(a.status)}</td></tr>`).join("")}
  </tbody></table></div>`;
},
admin_feecollection(){
  setTitle("Fee Collection","Track dues across the academy");
  return `<div class="card" style="margin-bottom:18px;"><h3>Collect a payment</h3>
    <div class="grid g3">
      <div class="field"><label>Student</label><input placeholder="Search student…"></div>
      <div class="field"><label>Amount</label><input type="number" placeholder="45000"></div>
      <div class="field"><label>Mode</label><select class="input-like" style="width:100%;"><option>UPI</option><option>Cash</option><option>Card</option><option>Bank Transfer</option></select></div>
    </div>
    <button class="btn-sm solid" onclick="showToast('Payment recorded')">Record payment</button></div>
  <div class="card"><table><thead><tr><th>Student</th><th>Batch</th><th>Fee Status</th></tr></thead><tbody>
    ${studentsList.map(s=>`<tr><td>${s.name}</td><td>${s.batch}</td><td>${pillFor(s.fee)}</td></tr>`).join("")}
  </tbody></table></div>`;
},
admin_teachers(){
  setTitle("Add Teachers","Manage faculty records");
  return `<div class="card" style="margin-bottom:18px;"><h3>Add a teacher</h3>
    <div class="grid g3">
      <div class="field"><label>Name</label><input placeholder="Full name"></div>
      <div class="field"><label>Subject</label><input placeholder="Physics"></div>
      <div class="field"><label>Batches</label><input placeholder="IIT-A, NEET-B"></div>
    </div>
    <button class="btn-sm solid" onclick="showToast('Teacher added')">Add teacher</button></div>
  <div class="card"><table><thead><tr><th>Name</th><th>Subject</th><th>Batches</th></tr></thead><tbody>
    <tr><td>Priya Mehta</td><td>Physics</td><td>IIT-A, NEET-B</td></tr>
    <tr><td>Suresh Rao</td><td>Chemistry</td><td>IIT-A, Foundation-C</td></tr>
    <tr><td>Anita Kulkarni</td><td>Mathematics</td><td>IIT-A</td></tr>
  </tbody></table></div>`;
},
admin_classes(){
  setTitle("Create Classes","Define class levels");
  return `<div class="card" style="margin-bottom:18px;"><h3>New class</h3>
    <div class="grid g3"><div class="field"><label>Class name</label><input placeholder="Class 12"></div>
    <div class="field"><label>Stream</label><select class="input-like" style="width:100%;"><option>JEE</option><option>NEET</option><option>Foundation</option></select></div>
    <div class="field"><label>Academic year</label><input placeholder="2026–27"></div></div>
    <button class="btn-sm solid" onclick="showToast('Class created')">Create class</button></div>
  <div class="grid g3">
    ${["Class 9","Class 10","Class 11","Class 12","Dropper Batch","Foundation"].map(c=>`<div class="card"><strong>${c}</strong><div style="font-size:12.5px; color:var(--ink-soft); margin-top:6px;">Active</div></div>`).join("")}
  </div>`;
},
admin_batches(){
  setTitle("Create Batches","Group students for teaching");
  return `<div class="card" style="margin-bottom:18px;"><h3>New batch</h3>
    <div class="grid g3"><div class="field"><label>Batch name</label><input placeholder="IIT-A"></div>
    <div class="field"><label>Class</label><select class="input-like" style="width:100%;"><option>11</option><option>12</option></select></div>
    <div class="field"><label>Capacity</label><input type="number" placeholder="60"></div></div>
    <button class="btn-sm solid" onclick="showToast('Batch created')">Create batch</button></div>
  <div class="card"><table><thead><tr><th>Batch</th><th>Class</th><th>Students</th><th>Capacity</th></tr></thead><tbody>
    <tr><td>IIT-A</td><td>12</td><td class="mono">58</td><td class="mono">60</td></tr>
    <tr><td>NEET-B</td><td>12</td><td class="mono">52</td><td class="mono">60</td></tr>
    <tr><td>Foundation-C</td><td>9</td><td class="mono">40</td><td class="mono">45</td></tr>
  </tbody></table></div>`;
},
admin_students(){
  setTitle("Manage Students","Search and edit student records");
  return `<div class="filter-row"><select class="input-like"><option>All classes</option><option>11</option><option>12</option></select>
    <select class="input-like"><option>All batches</option><option>IIT-A</option><option>NEET-B</option></select>
    <input class="input-like" placeholder="Search by name…" style="min-width:200px;"></div>
  <div class="card"><table><thead><tr><th>Name</th><th>Class</th><th>Batch</th><th>Fee</th><th>Attendance</th></tr></thead><tbody>
    ${studentsList.map(s=>`<tr><td>${s.name}</td><td>${s.class}</td><td>${s.batch}</td><td>${pillFor(s.fee)}</td><td class="mono">${s.attendance}</td></tr>`).join("")}
  </tbody></table></div>`;
},
admin_notices(){
  setTitle("Upload Notices","Publish to students and parents");
  return `<div class="card" style="margin-bottom:18px;"><h3>New notice</h3>
    <div class="field"><label>Title</label><input placeholder="Notice title"></div>
    <div class="field"><label>Message</label><textarea style="width:100%; min-height:80px; border:1.5px solid var(--line); border-radius:10px; padding:12px; font-family:inherit;" placeholder="Notice details…"></textarea></div>
    <button class="btn-sm solid" onclick="showToast('Notice published')">Publish notice</button></div>
  <div class="card">${noticeData.map(n=>`<div class="ledger-row"><div class="left"><strong>${n.title}</strong></div><span class="tag">${n.date}</span></div>`).join("")}</div>`;
},
admin_reports(){
  setTitle("Reports","Download academy-wide reports");
  return `<div class="grid g3">
    ${["Monthly Fee Report","Attendance Summary","Test Performance Report","Admissions Report","Faculty Workload Report","Batch-wise Report"].map(r=>`
    <div class="card"><div style="font-size:22px;">📑</div><h3 style="margin-top:10px;">${r}</h3><div style="font-size:12.5px; color:var(--ink-soft); margin-bottom:14px;">June 2026 · PDF / Excel</div>
    <button class="btn-sm" onclick="showToast('Generating report…')">Generate</button></div>`).join("")}
  </div>`;
},
admin_analytics(){
  setTitle("Analytics","Academy performance trends");
  return `<div class="grid g3" style="margin-bottom:18px;">
    <div class="card stat-card"><div class="lbl">Avg test score</div><div class="val">76%</div></div>
    <div class="card stat-card"><div class="lbl">Dropout risk</div><div class="val">12</div><div class="delta down">Students flagged</div></div>
    <div class="card stat-card"><div class="lbl">Top batch</div><div class="val mono" style="font-size:20px;">IIT-A</div></div>
  </div>
  <div class="card"><h3>Enrollment trend</h3><div style="display:flex; align-items:flex-end; gap:16px; height:160px; padding-top:10px;">
  ${[1800,1950,2080,2210,2340].map((v,i)=>`<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px;"><div style="width:100%; background:var(--accent); border-radius:6px 6px 0 0; height:${v/16}px;"></div><span style="font-size:11px; color:var(--ink-soft);">${["Feb","Mar","Apr","May","Jun"][i]}</span></div>`).join("")}
  </div></div>`;
},
};

function uploadForm(kind, placeholder){
  return `<div class="card" style="margin-bottom:18px;">
    <div class="grid g2">
      <div class="field"><label>Title</label><input placeholder="${placeholder}"></div>
      <div class="field"><label>Batch</label><select class="input-like" style="width:100%;"><option>IIT-A</option><option>NEET-B</option><option>Foundation-C</option></select></div>
    </div>
    <div class="upload-zone">⬆ Drag and drop a ${kind} file here, or click to browse</div>
    <button class="btn-sm solid" style="margin-top:14px;" onclick="showToast('${kind.charAt(0).toUpperCase()+kind.slice(1)} uploaded to batch')">Publish</button>
  </div>`;
}

function chatUI(name, msgs){
  setTitle("Messages", "Conversation with " + name);
  return `<div class="chat-window">
    <div class="chat-list" id="chat-list">
      ${msgs.map(m=>`<div class="msg ${m.who}">${m.text}<span class="time">${m.t}</span></div>`).join("")}
    </div>
    <div class="chat-input">
      <input id="chat-input-field" placeholder="Type a message…" onkeydown="if(event.key==='Enter')sendChat()">
      <button class="btn-sm solid" onclick="sendChat()">Send</button>
    </div>
  </div>`;
}
function sendChat(){
  const f = document.getElementById("chat-input-field");
  if(!f.value.trim()) return;
  const list = document.getElementById("chat-list");
  const div = document.createElement("div");
  div.className = "msg out";
  div.innerHTML = f.value + `<span class="time">Now</span>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
  f.value = "";
}

function renderSection(){
  const key = state.role + "_" + state.section;
  const fn = renderers[key];
  document.getElementById("content").innerHTML = fn ? fn() : `<div class="card empty"><div class="ic">🚧</div><h3>Coming soon</h3></div>`;
}

window.onload = ()=>{

    const token = localStorage.getItem("token");

    const user = JSON.parse(

        localStorage.getItem("user")

    );

    if(token && user){

        state.role=user.role.toLowerCase();

        state.section=NAV[state.role][0][0];

        document.getElementById("login-screen").style.display="none";

        document.getElementById("app-screen").style.display="block";

        document.getElementById("user-name").textContent=user.name;

        document.getElementById("user-sub").textContent=user.role;

        document.getElementById("user-avatar").textContent=user.name.charAt(0);

        document.getElementById("role-pill").textContent=ROLE_META[state.role].label;

        buildNav();

        renderSection();

        loadDashboardStats();

    }

}