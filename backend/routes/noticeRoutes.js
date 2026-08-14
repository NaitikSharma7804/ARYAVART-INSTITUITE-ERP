const express = require("express");
const router = express.Router();
const controller = require("../controllers/noticeController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// General Route (Everyone can view notices)
router.get("/", authenticate, controller.getNotices);

// Admin Only Routes (Create and Delete)
router.post("/", authenticate, authorize("ADMIN"), controller.uploadNotice);
router.delete("/:id", authenticate, authorize("ADMIN"), controller.deleteNotice);

module.exports = router;