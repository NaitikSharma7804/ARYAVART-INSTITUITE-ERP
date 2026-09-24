const express = require("express");
const router = express.Router();
const controller = require("../controllers/homeworkSubmissionController");
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/homework_submissions");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
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