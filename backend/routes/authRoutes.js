const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


// ================= REGISTER USER =================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user"
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful"
        });

    }

    catch (error) {

        console.error(
            "Registration error:",
            error.message
        );

        if (error.code === 11000) {

            return res.status(409).json({
                message: "Email is already registered"
            });

        }

        res.status(500).json({
            message: "Registration failed"
        });

    }

});


// ================= LOGIN USER =================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }

        const user =
            await User.findOne({
                email: email.trim().toLowerCase()
            });

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        if (!process.env.JWT_SECRET) {
            throw new Error(
                "JWT_SECRET is missing in .env"
            );
        }


        // JWT TOKEN WITH ROLE

        const token =
            jwt.sign(
                {
                    id: user._id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );


        res.status(200).json({

            message: "Login successful",

            token: token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    }

    catch (error) {

        console.error(
            "Login error:",
            error.message
        );

        res.status(500).json({
            message: "Login failed"
        });

    }

});


// ================= GET ALL USERS =================

router.get("/users", async (req, res) => {

    try {

        const users =
            await User.find()
                .select("-password")
                .sort({
                    createdAt: -1
                });

        res.json(users);

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


console.log("AUTH ROUTES LOADED");

module.exports = router;