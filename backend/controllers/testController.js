// const Test = require("../models/testModel");

// /*
// =====================================
// Teacher Assignment Options
// =====================================
// */

// exports.getOptions = async (req, res) => {

//     try {

//         const assignments = await Test.getTeacherAssignments(req.user.id);

//         res.json({

//             success: true,

//             assignments

//         });

//     }

//     catch (err) {

//         console.log(err);

//         res.status(500).json({

//             success: false,

//             message: err.message

//         });

//     }

// };

// /*
// =====================================
// Create Test
// =====================================
// */

// exports.createTest = async (req, res) => {

//     try {

//         const testId = await Test.createTest({

//             teacher_subject_id: req.body.teacher_subject_id,

//             title: req.body.title,

//             description: req.body.description,

//             duration: req.body.duration,

//             total_marks: req.body.total_marks,

//             test_date: req.body.test_date,

//             status: req.body.status

//         });

//         res.json({

//             success: true,

//             message: "Test Created Successfully",

//             test_id: testId

//         });

//     }

//     catch (err) {

//         console.log(err);

//         res.status(500).json({

//             success: false,

//             message: err.message

//         });

//     }

// };

// /*
// =====================================
// Add Question
// =====================================
// */

// exports.addQuestion = async (req, res) => {

//     try {

//         const questionId = await Test.addQuestion({

//             test_id: req.body.test_id,

//             question_text: req.body.question_text,

//             question_type: req.body.question_type,

//             option_a: req.body.option_a,

//             option_b: req.body.option_b,

//             option_c: req.body.option_c,

//             option_d: req.body.option_d,

//             correct_option: req.body.correct_option,

//             marks: req.body.marks,

//             question_order: req.body.question_order

//         });

//         res.json({

//             success: true,

//             question_id: questionId

//         });

//     }

//     catch (err) {

//         console.log(err);

//         res.status(500).json({

//             success: false,

//             message: err.message

//         });

//     }

// };

// /*
// =====================================
// Teacher Tests
// =====================================
// */

// exports.getTeacherTests = async (req, res) => {

//     try {

//         const tests = await Test.getTeacherTests(req.user.id);

//         res.json({

//             success: true,

//             tests

//         });

//     }

//     catch (err) {

//         console.log(err);

//         res.status(500).json({

//             success: false,

//             message: err.message

//         });

//     }

// };

// /*
// =====================================
// Single Test
// =====================================
// */

// exports.getTest = async (req, res) => {

//     try {

//         const test = await Test.getTestById(

//             req.params.id,

//             req.user.id

//         );

//         if (!test) {

//             return res.status(404).json({

//                 success: false,

//                 message: "Test Not Found"

//             });

//         }

//         const questions = await Test.getQuestions(

//             req.params.id

//         );

//         res.json({

//             success: true,

//             test,

//             questions

//         });

//     }

//     catch (err) {

//         console.log(err);

//         res.status(500).json({

//             success: false,

//             message: err.message

//         });

//     }

// };

// /*
// =====================================
// Update Test
// =====================================
// */

// exports.updateTest = async (req, res) => {

//     try {

//         await Test.updateTest({

//             test_id: req.params.id,

//             teacher_subject_id: req.body.teacher_subject_id,

//             title: req.body.title,

//             description: req.body.description,

//             duration: req.body.duration,

//             total_marks: req.body.total_marks,

//             test_date: req.body.test_date,

//             status: req.body.status

//         });

//         res.json({

//             success: true,

//             message: "Test Updated Successfully"

//         });

//     }

//     catch (err) {

//         console.log(err);

//         res.status(500).json({

//             success: false,

//             message: err.message

//         });

//     }

// };

// /*
// =====================================
// Delete Test
// =====================================
// */

// exports.deleteTest = async (req, res) => {

//     try {

//         const deleted = await Test.deleteTest(

//             req.params.id,

//             req.user.id

//         );

//         if (!deleted) {

//             return res.status(404).json({

//                 success: false,

//                 message: "Test Not Found"

//             });

//         }

//         res.json({

//             success: true,

//             message: "Test Deleted Successfully"

//         });

//     }

//     catch (err) {

//         console.log(err);

//         res.status(500).json({

//             success: false,

//             message: err.message

//         });

//     }

// };

const Test = require("../models/testModel");

/* ================= TEACHER ENDPOINTS ================= */

exports.getOptions = async (req, res) => {
    try {
        const assignments = await Test.getTeacherAssignments(req.user.id);
        res.json({ success: true, assignments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getTeacherTests = async (req, res) => {
    try {
        const tests = await Test.getTeacherTests(req.user.id);
        res.json({ success: true, tests });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getTest = async (req, res) => {
    try {
        const test = await Test.getTestById(req.params.id);
        if (!test) return res.status(404).json({ success: false, message: "Test Not Found" });
        const questions = await Test.getQuestions(req.params.id);
        res.json({ success: true, test, questions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createTest = async (req, res) => {
    try {
        const testId = await Test.createTest(req.body);
        res.json({ success: true, message: "Test Created", test_id: testId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateTest = async (req, res) => {
    try {
        await Test.updateTest({ ...req.body, test_id: req.params.id });
        res.json({ success: true, message: "Test Updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.publishTest = async (req, res) => {
    try {
        await Test.publishTest(req.params.id);
        res.json({ success: true, message: "Test Published" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteTest = async (req, res) => {
    try {
        await Test.deleteTest(req.params.id, req.user.id);
        res.json({ success: true, message: "Test Deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/* ================= QUESTION BUILDER ENDPOINTS ================= */

exports.addQuestion = async (req, res) => {
    try {
        const questionId = await Test.addQuestion(req.body);
        res.json({ success: true, question_id: questionId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        await Test.updateQuestion({ ...req.body, question_id: req.params.questionId });
        res.json({ success: true, message: "Question Updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        await Test.deleteQuestion(req.params.questionId);
        res.json({ success: true, message: "Question Deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/* ================= STUDENT ENDPOINTS ================= */

exports.getStudentTests = async (req, res) => {
    try {
        const tests = await Test.getStudentTests(req.user.id);
        res.json({ success: true, tests });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.startTestAttempt = async (req, res) => {
    try {
        const attemptId = await Test.startTestAttempt(req.params.id, req.user.id);
        const test = await Test.getTestById(req.params.id);
        const questions = await Test.getQuestions(req.params.id);
        // Do not send correct options to the student
        const safeQuestions = questions.map(q => ({
            question_id: q.question_id,
            question_text: q.question_text,
            question_type: q.question_type,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            marks: q.marks,
            question_order: q.question_order
        }));
        res.json({ success: true, attempt_id: attemptId, test, questions: safeQuestions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.saveAnswer = async (req, res) => {
    try {
        const { attempt_id, question_id, answer_text, selected_option } = req.body;
        await Test.saveStudentAnswer(attempt_id, question_id, answer_text, selected_option);
        res.json({ success: true, message: "Answer Saved" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.submitTestAttempt = async (req, res) => {
    try {
        await Test.submitTestAttempt(req.body.attempt_id);
        res.json({ success: true, message: "Test Submitted Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};