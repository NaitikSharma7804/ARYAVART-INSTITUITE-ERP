const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const controller = require("../controllers/studentController");

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    controller.getStudents
);

module.exports = router;