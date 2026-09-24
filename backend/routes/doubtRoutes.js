const express = require('express');
const router = express.Router();
const DoubtController = require("../controllers/doubtController");
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

// Student Routes
router.post('/ask', authenticate, DoubtController.askDoubt);
router.get('/', authenticate, DoubtController.getDoubts);

// Teacher Routes
router.get("/teacher", authenticate, authorize("TEACHER"), DoubtController.getTeacherDoubts);
router.put("/teacher/reply/:id", authenticate, authorize("TEACHER"), DoubtController.replyDoubt);

// Add this to your DoubtRoutes.js
// This creates a dedicated path for AI queries: POST /api/doubts/ai-ask
router.post('/ai-ask', authenticate, DoubtController.askAI);

module.exports = router;