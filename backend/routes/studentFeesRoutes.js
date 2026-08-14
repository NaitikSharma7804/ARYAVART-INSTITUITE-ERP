// routes/studentfeesroutes.js
const express = require("express");
const router = express.Router();
const feeController = require("../controllers/studentFeeController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Ensure this path is '/fees' because your script.js calls apiRequest("/fees")
router.get("/fees", authenticate, authorize("STUDENT"), feeController.getFees);

module.exports = router;