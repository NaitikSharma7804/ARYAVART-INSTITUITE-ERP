

const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api"
    : "/api";

async function apiRequest(endpoint, method = "GET", body = null) {

    const token = localStorage.getItem("token");

    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (token) {
        options.headers.Authorization = `Bearer ${token}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

/*
=====================================
Notes
=====================================
*/

async function loadNotesOptions() {

    return await apiRequest(

        "/notes/options"

    );

}

async function loadTeacherNotes() {

    return await apiRequest(

        "/notes"

    );

}

async function uploadNote(formData) {

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

async function apiDeleteNote(noteId) {
    return await apiRequest(`/notes/${noteId}`, "DELETE");
}

async function getNote(noteId) {

    return await apiRequest(

        `/notes/${noteId}`

    );

}

async function updateNote(noteId, formData) {

    const token = localStorage.getItem("token");

    const response = await fetch(

        `${API_URL}/notes/${noteId}`,

        {

            method: "PUT",

            headers: {

                Authorization: `Bearer ${token}`

            },

            body: formData

        }

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(

            data.message || "Update Failed"

        );

    }

    return data;

}

/*
=====================================
Videos
=====================================
*/

async function loadVideoOptions() {

    return await apiRequest(

        "/videos/options"

    );

}

async function loadTeacherVideos() {

    return await apiRequest(

        "/videos"

    );

}

async function uploadVideo(data) {

    return await apiRequest(

        "/videos",

        "POST",

        data

    );

}

async function getVideo(videoId) {

    return await apiRequest(

        `/videos/${videoId}`

    );

}

async function updateVideo(videoId, data) {

    return await apiRequest(

        `/videos/${videoId}`,

        "PUT",

        data

    );

}

async function deleteVideo(videoId) {

    return await apiRequest(

        `/videos/${videoId}`,

        "DELETE"

    );

}

/*
=====================================
Tests
=====================================
*/

async function loadTestOptions() {

    return await apiRequest(

        "/tests/options"

    );

}

async function loadTeacherTests() {

    return await apiRequest(

        "/tests"

    );

}

async function createTest(data) {

    return await apiRequest(

        "/tests",

        "POST",

        data

    );

}

async function addQuestion(data) {

    return await apiRequest(

        "/tests/question",

        "POST",

        data

    );

}

async function getTest(testId) {

    return await apiRequest(

        `/tests/${testId}`

    );

}

async function updateTest(testId, data) {

    return await apiRequest(

        `/tests/${testId}`,

        "PUT",

        data

    );

}

async function deleteTest(testId) {

    return await apiRequest(

        `/tests/${testId}`,

        "DELETE"

    );

}

/* ================= TESTS API EXTENSIONS ================= */
async function updateQuestion(questionId, data) {
    return await apiRequest(`/tests/question/${questionId}`, "PUT", data);
}

async function deleteQuestion(questionId) {
    return await apiRequest(`/tests/question/${questionId}`, "DELETE");
}

async function publishTest(testId) {
    return await apiRequest(`/tests/${testId}/publish`, "PUT");
}

async function getStudentTests() {
    return await apiRequest("/tests/student/all");
}

async function startTestAttempt(testId) {
    return await apiRequest(`/tests/student/${testId}/start`, "POST");
}

async function saveStudentAnswer(attemptId, questionId, text, option) {
    return await apiRequest("/tests/student/answer", "POST", { attempt_id: attemptId, question_id: questionId, answer_text: text, selected_option: option });
}

async function submitTestAttempt(attemptId) {
    return await apiRequest("/tests/student/submit", "POST", { attempt_id: attemptId });
}

/* ================= HOMEWORK SUBMISSIONS API ================= */
async function getStudentHomeworkList() {
    return await apiRequest("/homework-submissions/student");
}

async function submitStudentHomework(formData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/homework-submissions/student/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Upload Failed");
    return data;
}

async function getTeacherHomeworkCheckList() {
    return await apiRequest("/homework-submissions/teacher");
}

async function getSubmissionsForHomework(homeworkId) {
    return await apiRequest(`/homework-submissions/teacher/${homeworkId}/submissions`);
}

async function gradeHomeworkSubmission(submissionId, data) {
    return await apiRequest(`/homework-submissions/teacher/grade/${submissionId}`, "PUT", data);
}

/* ================= DOUBTS API ================= */
async function loadTeacherDoubts() {
    return await apiRequest("/doubts/teacher");
}

async function replyToTeacherDoubt(doubtId, answerText) {
    return await apiRequest(`/doubts/teacher/reply/${doubtId}`, "PUT", { answer: answerText });
}

/* ================= ANALYTICS API ================= */
async function loadTeacherAnalytics() {
    return await apiRequest("/analytics/teacher");
}

/* ================= MESSAGES API ================= */
async function loadMessageContacts() {
    return await apiRequest("/messages/teacher/contacts");
}

async function loadConversation(userId) {
    return await apiRequest(`/messages/conversation/${userId}`);
}

async function sendMessageApi(receiverId, content) {
    return await apiRequest("/messages/send", "POST", { receiver_id: receiverId, content });
}

/* ================= FEES API (ADMIN) ================= */
async function loadFeeDashboard() {
    return await apiRequest("/fees/dashboard");
}

async function recordFeePaymentApi(feeId, amount, mode) {
    return await apiRequest("/fees/pay", "POST", { fee_id: feeId, amount, mode });
}

/* ================= NOTICES API ================= */
async function loadNotices() {
    return await apiRequest("/notices");
}

async function createNoticeApi(title, description) {
    return await apiRequest("/notices", "POST", { title, description });
}

async function deleteNoticeApi(noticeId) {
    return await apiRequest(`/notices/${noticeId}`, "DELETE");
}

/* ================= REPORTS API ================= */
async function fetchReportData(reportType) {
    return await apiRequest(`/reports/${reportType}`);
}

/* ================= ADMIN ANALYTICS API ================= */
async function loadAdminAnalytics() {
    return await apiRequest("/admin-analytics");
}
/* ================= STUDENT DASHBOARD API ================= */
async function loadStudentDashboard() {
    return await apiRequest("/student-dashboard");
}
/* ================= STUDENT TIMETABLE API ================= */
async function loadStudentTimetable() {
    return await apiRequest("/student-timetable");
}
/* ================= STUDENT ATTENDANCE API ================= */
async function loadStudentAttendance() {
    return await apiRequest("/student-attendance");
}

/* ================= STUDENT NOTES API ================= */
async function loadStudentNotes() {
    return await apiRequest("/student-notes");
}

/* ================= STUDENT VIDEOS API ================= */
async function loadStudentVideos() {
    return await apiRequest("/student-videos");
}

async function loadTestResults() {
    return await apiRequest("/test-results");
}

async function requestGeneratedTest(syllabusData, settings) {
    const response = await fetch('/api/ai/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabusData, settings })
    });
    return await response.json(); // Returns structured JSON { title, questions: [] }
}