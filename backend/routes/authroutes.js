const express = require("express");
const router = express.Router();

const {
    register,
    login,
    googleAuth,
    getAuthConfig
} = require("../controllers/authcontroller");

/*
========================================
AUTH ROUTES
========================================
*/

// Register with Mobile Number
router.post("/register", register);

// Login with Mobile Number or Email
router.post("/login", login);

// Sign-In & Register with Google
router.post("/google", googleAuth);

// Get Public Auth Configuration (Google Client ID, etc.)
router.get("/config", getAuthConfig);

module.exports = router;
