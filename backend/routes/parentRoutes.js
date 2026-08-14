const express = require("express");
const router = express.Router();
const parentController = require("../controllers/parentController");

// Use destructuring to get the specific functions from the export object
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Ensure no parentheses are used here
router.get("/dashboard", authenticate, authorize("PARENT"), parentController.getDashboard);
// Add this to your existing routes
// Ensure the route string is "/live-attendance"
router.get("/live-attendance", authenticate, authorize("PARENT"), parentController.getAttendance);

// Add this route to your parentRoutes.js
router.get("/fees", authenticate, authorize("PARENT"), parentController.getFees);

router.get("/performance", authenticate, authorize("PARENT"), parentController.getPerformance);

router.get("/homework-status", authenticate, authorize("PARENT"), parentController.getHomeworkStatus);

router.get("/remarks", authenticate, authorize("PARENT"), parentController.getRemarks);

router.get("/upcoming-exams", authenticate, authorize("PARENT"), parentController.getUpcomingExams);

router.get("/notices", authenticate, authorize("PARENT"), parentController.getNotices);

router.get("/chat", authenticate, authorize("PARENT"), parentController.getMessages);
router.post("/chat", authenticate, authorize("PARENT"), parentController.sendMessage);
router.get("/monthly-report", authenticate, authorize("PARENT"), parentController.getMonthlyReport);

module.exports = router;