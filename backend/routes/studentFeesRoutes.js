// routes/studentfeesroutes.js
const express = require("express");
const router = express.Router();
const feeController = require("../controllers/studentFeeController");
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

// Ensure this path is '/fees' because your script.js calls apiRequest("/fees")
router.get("/fees", authenticate, authorize("STUDENT"), feeController.getFees);

module.exports = router;