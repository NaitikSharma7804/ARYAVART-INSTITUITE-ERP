const express = require("express");
const router = express.Router();
const controller = require("../controllers/testResultController");
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

router.get("/", authenticate, authorize("STUDENT"), controller.getResults);

module.exports = router;