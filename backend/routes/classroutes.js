const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const controller = require("../controllers/classController");

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    controller.getClasses
);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    controller.addClass
);

module.exports = router;