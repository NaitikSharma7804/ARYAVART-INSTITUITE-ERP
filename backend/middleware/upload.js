const multer = require("multer");
const path = require("path");
const fs = require("fs");

function createUploader(folder) {

    const uploadPath = process.env.VERCEL 
        ? path.join("/tmp", folder)
        : path.join(__dirname, "..", "uploads", folder);

    try {
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
    } catch (e) {
        console.warn("Could not create uploadPath in read-only filesystem:", e.message);
    }

    const storage = multer.diskStorage({

        destination(req, file, cb) {

            cb(null, uploadPath);

        },

        filename(req, file, cb) {

            const uniqueName =
                Date.now() +
                "-" +
                Math.round(Math.random() * 1e9) +
                path.extname(file.originalname);

            cb(null, uniqueName);

        }

    });

    return multer({

        storage,

        limits: {

            fileSize: 20 * 1024 * 1024

        }

    });

}

module.exports = createUploader;