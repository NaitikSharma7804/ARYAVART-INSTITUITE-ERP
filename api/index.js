let app;
let initError = null;

try {
    app = require('../backend/server');
} catch (e) {
    initError = e;
    console.error("Fatal backend initialization error:", e);
}

module.exports = (req, res) => {
    if (initError) {
        return res.status(500).json({
            success: false,
            error: "Backend Initialization Error",
            message: initError.message,
            stack: initError.stack
        });
    }

    try {
        return app(req, res);
    } catch (err) {
        console.error("Serverless execution error:", err);
        return res.status(500).json({
            success: false,
            error: "Serverless Execution Error",
            message: err.message,
            stack: err.stack
        });
    }
};
