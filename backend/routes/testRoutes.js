// const express = require("express");

// const router = express.Router();

// const controller = require("../controllers/testController");

// const authenticate = require("../middleware/authMiddleware");

// const authorize = require("../middleware/roleMiddleware");

// /*
// =====================================
// Teacher Assignment Options
// =====================================
// */

// router.get(

//     "/options",

//     authenticate,

//     authorize("TEACHER"),

//     controller.getOptions

// );

// /*
// =====================================
// Teacher Tests
// =====================================
// */

// router.get(

//     "/",

//     authenticate,

//     authorize("TEACHER"),

//     controller.getTeacherTests

// );

// /*
// =====================================
// Single Test
// =====================================
// */

// router.get(

//     "/:id",

//     authenticate,

//     authorize("TEACHER"),

//     controller.getTest

// );

// /*
// =====================================
// Create Test
// =====================================
// */

// router.post(

//     "/",

//     authenticate,

//     authorize("TEACHER"),

//     controller.createTest

// );

// /*
// =====================================
// Add Question
// =====================================
// */

// router.post(

//     "/question",

//     authenticate,

//     authorize("TEACHER"),

//     controller.addQuestion

// );

// /*
// =====================================
// Update Test
// =====================================
// */

// router.put(

//     "/:id",

//     authenticate,

//     authorize("TEACHER"),

//     controller.updateTest

// );

// /*
// =====================================
// Delete Test
// =====================================
// */

// router.delete(

//     "/:id",

//     authenticate,

//     authorize("TEACHER"),

//     controller.deleteTest

// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/testController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Teacher Routes
router.get("/options", authenticate, authorize("TEACHER"), controller.getOptions);
router.get("/", authenticate, authorize("TEACHER"), controller.getTeacherTests);
router.get("/:id", authenticate, authorize("TEACHER"), controller.getTest);
router.post("/", authenticate, authorize("TEACHER"), controller.createTest);
router.put("/:id", authenticate, authorize("TEACHER"), controller.updateTest);
router.put("/:id/publish", authenticate, authorize("TEACHER"), controller.publishTest);
router.delete("/:id", authenticate, authorize("TEACHER"), controller.deleteTest);

// Question Builder Routes
router.post("/question", authenticate, authorize("TEACHER"), controller.addQuestion);
router.put("/question/:questionId", authenticate, authorize("TEACHER"), controller.updateQuestion);
router.delete("/question/:questionId", authenticate, authorize("TEACHER"), controller.deleteQuestion);

// Student Routes
router.get("/student/all", authenticate, authorize("STUDENT"), controller.getStudentTests);
router.post("/student/:id/start", authenticate, authorize("STUDENT"), controller.startTestAttempt);
router.post("/student/answer", authenticate, authorize("STUDENT"), controller.saveAnswer);
router.post("/student/submit", authenticate, authorize("STUDENT"), controller.submitTestAttempt);

module.exports = router;