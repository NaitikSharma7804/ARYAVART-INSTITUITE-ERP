const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const User = require("../models/userModel");

/*
=========================================
REGISTER USER (MOBILE / EMAIL)
=========================================
*/
const register = async (req, res) => {
    try {
        const {
            full_name,
            phone,
            password,
            role,
            email
        } = req.body;

        // Check required fields
        if (!full_name || !phone || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields: Name, Mobile Number, Password, and Role."
            });
        }

        // Clean & normalize mobile number (strip spaces, hyphens, parentheses)
        const cleanPhone = phone.toString().replace(/[\s\-\(\)]/g, "");
        if (cleanPhone.length < 10) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit mobile number."
            });
        }

        // Check phone already exists
        const existingPhone = await User.findByPhone(cleanPhone);
        if (existingPhone) {
            return res.status(409).json({
                success: false,
                message: "This mobile number is already registered. Please sign in."
            });
        }

        // Check email already exists (if provided)
        let cleanEmail = null;
        if (email && email.trim()) {
            cleanEmail = email.trim().toLowerCase();
            const existingEmail = await User.findByEmail(cleanEmail);
            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: "This email address is already registered."
                });
            }
        }

        const validRoles = ["STUDENT", "PARENT", "TEACHER", "ADMIN"];
        const normalizedRole = role.toString().toUpperCase();
        if (!validRoles.includes(normalizedRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role selected."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long."
            });
        }

        // Encrypt password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user in users table
        const userId = await User.createUser({
            full_name: full_name.trim(),
            email: cleanEmail,
            phone: cleanPhone,
            password_hash,
            role: normalizedRole,
            status: "ACTIVE"
        });

        // Automatically initialize role profile (student, teacher, or parent entry)
        await User.createUserRoleProfile(userId, normalizedRole);

        // Generate JWT token so the user is instantly authenticated
        const token = jwt.sign(
            {
                id: userId,
                role: normalizedRole
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES || "7d"
            }
        );

        return res.status(201).json({
            success: true,
            message: "Registration Successful",
            token,
            user: {
                id: userId,
                name: full_name.trim(),
                role: normalizedRole,
                phone: cleanPhone,
                email: cleanEmail
            }
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

/*
=========================================
GOOGLE SIGN-IN & REGISTRATION
=========================================
*/
const googleAuth = async (req, res) => {
    try {
        const { credential, role, phone } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential token is required."
            });
        }

        // Verify Google ID token via Google's tokeninfo API
        const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
        const verifyRes = await fetch(verifyUrl);

        if (!verifyRes.ok) {
            return res.status(401).json({
                success: false,
                message: "Google authentication failed: Invalid or expired token."
            });
        }

        const payload = await verifyRes.json();

        if (!payload.email || !payload.sub) {
            return res.status(401).json({
                success: false,
                message: "Unable to retrieve email from Google token."
            });
        }

        // Check audience if GOOGLE_CLIENT_ID is configured in environment
        if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
            return res.status(401).json({
                success: false,
                message: "Google Client ID does not match server configuration."
            });
        }

        const email = payload.email.toLowerCase();
        const fullName = payload.name || email.split("@")[0];
        const picture = payload.picture || null;

        // Check if user already exists
        let user = await User.findByEmail(email);
        let isNew = false;

        if (!user) {
            isNew = true;

            let cleanPhone = null;
            if (phone && phone.trim()) {
                cleanPhone = phone.toString().replace(/[\s\-\(\)]/g, "");
                const phoneCheck = await User.findByPhone(cleanPhone);
                if (phoneCheck) {
                    return res.status(409).json({
                        success: false,
                        message: "Mobile number is already associated with another account."
                    });
                }
            }

            const validRoles = ["STUDENT", "PARENT", "TEACHER", "ADMIN"];
            let chosenRole = (role || "STUDENT").toString().toUpperCase();
            if (!validRoles.includes(chosenRole)) {
                chosenRole = "STUDENT";
            }

            const userId = await User.createUser({
                full_name: fullName,
                email,
                phone: cleanPhone,
                password_hash: null, // Google authenticated users do not require a local password
                role: chosenRole,
                profile_photo: picture,
                status: "ACTIVE"
            });

            await User.createUserRoleProfile(userId, chosenRole);
            user = await User.findById(userId);
        } else {
            // Update profile photo if not already set
            if (!user.profile_photo && picture) {
                try {
                    await db.query("UPDATE users SET profile_photo = ? WHERE user_id = ?", [picture, user.user_id]);
                    user.profile_photo = picture;
                } catch (e) {
                    console.error("Error updating profile photo:", e);
                }
            }
        }

        const token = jwt.sign(
            {
                id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES || "7d"
            }
        );

        return res.json({
            success: true,
            message: isNew ? "Google Registration Successful" : "Google Login Successful",
            token,
            user: {
                id: user.user_id,
                name: user.full_name,
                role: user.role,
                email: user.email,
                phone: user.phone,
                photo: user.profile_photo
            }
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

/*
=========================================
LOGIN USER (PHONE OR EMAIL)
=========================================
*/
const login = async (req, res) => {
    try {
        const identifier = (req.body.phone || req.body.email || req.body.identifier || "").toString().trim();
        const { password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Mobile number/Email and Password are required."
            });
        }

        let user;
        if (identifier.includes("@")) {
            user = await User.findByEmail(identifier.toLowerCase());
        } else {
            const cleanPhone = identifier.replace(/[\s\-\(\)]/g, "");
            user = await User.findByPhone(cleanPhone);
            if (!user) {
                user = await User.findByPhone(identifier);
            }
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials: No account found with this phone/email."
            });
        }

        if (!user.password_hash) {
            return res.status(401).json({
                success: false,
                message: "This account was registered using Google. Please sign in using 'Continue with Google'."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials: Incorrect password."
            });
        }

        const token = jwt.sign(
            {
                id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES || "7d"
            }
        );

        return res.json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user.user_id,
                name: user.full_name,
                role: user.role,
                phone: user.phone,
                email: user.email,
                photo: user.profile_photo
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

/*
=========================================
GET AUTH CONFIGURATION
=========================================
*/
const getAuthConfig = (req, res) => {
    res.json({
        success: true,
        googleClientId: process.env.GOOGLE_CLIENT_ID || ""
    });
};

module.exports = {
    register,
    login,
    googleAuth,
    getAuthConfig
};
