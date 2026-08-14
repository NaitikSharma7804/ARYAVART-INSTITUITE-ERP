const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Ensure the path here does NOT repeat '/api/admin' 
// because you already added it in server.js
router.post("/create-user", authenticate, authorize("ADMIN"), adminController.createUser);

module.exports = router;