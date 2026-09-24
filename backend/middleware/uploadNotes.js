const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = process.env.VERCEL ? path.join("/tmp", "notes") : path.join(__dirname, "../uploads/notes");
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (e) {
    console.warn("Could not create uploadDir in read-only filesystem:", e.message);
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

module.exports = multer({
    storage,
    fileFilter(req, file, cb) {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed."));
        }
    }
});