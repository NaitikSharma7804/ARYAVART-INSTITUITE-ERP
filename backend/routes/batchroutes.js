const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const controller = require("../controllers/batchController");

router.get("/", authenticate, authorize("ADMIN"), controller.getBatches);
router.post("/", authenticate, authorize("ADMIN"), controller.createBatch);
router.put("/:id", authenticate, authorize("ADMIN"), controller.updateBatch);
router.delete("/:id", authenticate, authorize("ADMIN"), controller.deleteBatch);

module.exports = router;