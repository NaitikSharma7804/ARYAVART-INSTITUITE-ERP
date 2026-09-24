const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentNotesController");
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

// Route restricted to STUDENTS
router.get("/", authenticate, authorize("STUDENT"), controller.getNotes);

module.exports = router;