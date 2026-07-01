const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const controller = require("../controllers/subjectController");

router.get("/", auth, authorize("ADMIN"), controller.getSubjects);

router.post("/", auth, authorize("ADMIN"), controller.createSubject);

router.get("/:id", auth, authorize("ADMIN"), controller.getSubject);

router.put("/:id", auth, authorize("ADMIN"), controller.updateSubject);

router.delete("/:id", auth, authorize("ADMIN"), controller.deleteSubject);

module.exports = router;