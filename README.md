# 🏛️ Aryavart Institute ERP

> A full-stack, role-based Institute Management and Enterprise Resource Planning (ERP) web application designed to streamline administration, academics, communication, and AI-assisted learning for coaching centers and educational institutes.

---

## 🚀 Features

### 🎓 Student Portal
* **Dashboard:** Live attendance, pending homework summary, last test score, and fee due alerts.
* **Timetable:** Weekly visual layout of scheduled classes, subjects, and assigned teachers.
* **Attendance Tracking:** Monthly percentage analytics and detailed historical attendance logs.
* **Homework Management:** View assignments, check submission status, upload documents (PDF/Images), and view teacher feedback and grades.
* **Study Materials & Lectures:** Access daily notes and watch recorded video lectures (YouTube/Google Drive integrations).
* **Examinations & Results:** Take live timed tests with automated submission, and view detailed grade sheets, percentiles, and ranks.
* **Fee Status:** Visual fee clearance tracking and installment breakdown.
* **Ask Doubts (Human-to-Teacher):** Submit questions directly to assigned faculty and track resolution status.
* **AI Chat Assistant:** Integrated AI chatbot (powered by OpenRouter/Gemini) to instantly answer curriculum and syllabus questions.

### 👪 Parent Portal
* **Child Progress Dashboard:** Real-time metrics on attendance, test scores, and homework completion.
* **Live Attendance & Performance:** Monitor day-to-day presence and score trends across recent examinations.
* **Fee Ledger & Remarks:** Track fee dues and view direct faculty notes/remarks regarding the student.
* **Notices & Chat:** Receive official academy notices and securely message teachers.

### 📋 Teacher Portal
* **Class Management & Attendance:** View daily schedules and mark interactive attendance for specific batches.
* **Homework & Material Upload:** Create assignments, upload chapter notes (PDF), and publish recorded lectures.
* **Test Generator:** Build, draft, and publish custom examinations with multiple question types (MCQ, Short, Long answer).
* **Submission Grading:** Review student homework files, assign marks, and provide written feedback.
* **Doubt Resolution:** Filter and reply to pending student doubts.
* **Parent Communication:** Direct messaging interface with student guardians.

### 🏛️ Admin Panel
* **Institute-Wide Dashboard:** Overview of total students, teachers, fee collection metrics, and admission trends.
* **Admissions & User Management:** Securely create and manage user credentials, student rosters, and faculty assignments.
* **Structure & Setup:** Define classes, academic streams, and student batches with capacity limits.
* **Timetable & Subject Control:** Allocate teachers to subjects and schedule weekly institute timetables.
* **Fee & Finance Tracking:** Monitor fee collection progress and record incoming payments.
* **Notice Board & Reports:** Publish system-wide announcements and export detailed CSV reports (Fees, Admissions, Faculty Roster, Batches).

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Modular UI rendering pattern)
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **AI Integration:** OpenRouter API (Google Gemma / Gemini models)
* **Security & Middleware:** Helmet, CORS, Morgan, Cookie-Parser, JSON Web Tokens (JWT) for authentication

---

## 📁 Project Structure

```text
ARYAVART-INSTITUTE-ERP/
│
├── backend/
│   ├── config/          # Database and environment configurations
│   ├── controllers/     # Business logic for routes (Auth, Students, Teachers, AI, etc.)
│   ├── middleware/      # Authentication and security middleware
│   ├── models/          # Database query models
│   ├── routes/          # Express API route endpoints
│   ├── services/        # AI integration services (OpenRouter/Gemini)
│   ├── uploads/         # Storage for uploaded notes, homework files, etc.
│   ├── server.js        # Entry point for the Express server
│   └── package.json     # Backend dependencies
│
├── frontend/
│   ├── js/              # Frontend API wrappers and utilities
│   ├── index.html       # Main single-page application shell
│   └── style.css        # Custom styles and design system
│
└── README.md
