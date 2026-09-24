const express = require("express");
const router = express.Router();
const controller = require("../controllers/homeworkSubmissionController");
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists (use /tmp on serverless environments like Vercel)
const uploadDir = process.env.VERCEL ? path.join("/tmp", "homework_submissions") : path.join(__dirname, "../uploads/homework_submissions");
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (e) {
    console.warn("Could not create uploadDir in read-only filesystem:", e.message);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `hw_${Date.now()}_${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Student Routes
router.get("/student", authenticate, authorize("STUDENT"), controller.getStudentHomework);
router.post("/student/submit", authenticate, authorize("STUDENT"), upload.single("file"), controller.submitHomework);

// Teacher Routes
router.get("/teacher", authenticate, authorize("TEACHER"), controller.getTeacherHomeworkList);
router.get("/teacher/:homeworkId/submissions", authenticate, authorize("TEACHER"), controller.getHomeworkSubmissions);
router.put("/teacher/grade/:submissionId", authenticate, authorize("TEACHER"), controller.gradeSubmission);

module.exports = router;