const express = require("express");
const router = express.Router();
const controller = require("../controllers/messageController");
const authenticate = require("../middleware/authmiddleware");

router.get("/teacher/contacts", authenticate, controller.getContacts);
router.get("/conversation/:userId", authenticate, controller.getConversation);
router.post("/send", authenticate, controller.sendMessage);

module.exports = router;    