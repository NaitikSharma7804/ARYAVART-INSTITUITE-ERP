const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const controller = require("../controllers/timetableController");

router.get(
    "/",
    auth,
    authorize("ADMIN"),
    controller.getTimetable
);

router.post(
    "/",
    auth,
    authorize("ADMIN"),
    controller.createTimetable
);

router.delete(
    "/:id",
    auth,
    authorize("ADMIN"),
    controller.deleteTimetable
);

module.exports = router;