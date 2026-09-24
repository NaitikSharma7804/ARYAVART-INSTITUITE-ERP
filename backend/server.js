require('dotenv').config(); 
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authenticate = require("./middleware/authMiddleware");
const dashboardRoutes=require("./routes/dashboardRoutes");

require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");

const batchRoutes=require("./routes/batchRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const attendanceRoutes=require("./routes/attendanceRoutes");
const teacherDashboardRoutes=require("./routes/teacherDashboardRoutes");
const homeworkRoutes = require("./routes/homeworkRoutes");
const path = require("path");
const notesRoutes = require("./routes/notesRoutes");
const videoRoutes = require("./routes/videoRoutes");
const testRoutes = require("./routes/testRoutes");
const homeworkSubmissionRoutes = require("./routes/homeworkSubmissionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const feeRoutes = require("./routes/feeRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminAnalyticsRoutes = require("./routes/adminAnalyticsRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");
const studentTimetableRoutes = require("./routes/studentTimetableRoutes");
const studentAttendanceRoutes = require("./routes/studentAttendanceRoutes");
const studentNotesRoutes = require("./routes/studentNotesRoutes");
const studentVideoRoutes = require("./routes/studentVideoRoutes");
const testResultRoutes = require("./routes/testResultRoutes");
const studentFeesRoutes = require("./routes/studentfeesroutes");
const studentDoubtRoutes = require("./routes/doubtRoutes")
const doubtRoutes = require('./routes/doubtRoutes');
const parentRoutes = require("./routes/parentRoutes");

const adminRoutes = require("./routes/adminroutes");





const app = express();


app.use(helmet());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Private-Network", "true");
    next();
});

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(

"/api/batches",

batchRoutes

);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Aryavart Institute ERP API"
    });
});

/*
===================================
TEMPORARY TEST ROUTE
===================================
*/

app.get("/api/test", authenticate, (req, res) => {

    res.json({

        success: true,

        message: "Protected Route Working",

        user: req.user

    });

});
app.use("/api/classes", classRoutes);

app.use(

"/api/dashboard",

dashboardRoutes

);

app.use(

    "/api/students",

    studentRoutes

);

app.use("/api/teachers", teacherRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});

app.use("/api/subjects", subjectRoutes);

app.use("/api/assignments", assignmentRoutes);

app.use("/api/timetable", timetableRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use(
"/api/teacher/dashboard",
teacherDashboardRoutes
);

app.use("/api/homework", homeworkRoutes);

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

app.use("/api/notes", notesRoutes);

app.use("/api/videos", videoRoutes);

app.use("/api/tests", testRoutes);

app.use("/api/homework-submissions", homeworkSubmissionRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/fees", feeRoutes);

app.use("/api/notices", noticeRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/admin-analytics", adminAnalyticsRoutes);


app.use("/api/student-dashboard", studentDashboardRoutes);
app.use("/api/student-timetable", studentTimetableRoutes);

app.use("/api/student-attendance", studentAttendanceRoutes);

app.use("/api/student-notes", studentNotesRoutes);
app.use("/api/student-videos", studentVideoRoutes);
app.use("/api/test-results", testResultRoutes);

app.use("/api", studentFeesRoutes);


app.use("/api/parent", parentRoutes);

app.use("/api/admin", adminRoutes);


app.use('/api/doubts', doubtRoutes);