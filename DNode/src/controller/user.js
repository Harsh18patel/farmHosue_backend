const jwt = require('jsonwebtoken');
const User = require("../models/user");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const generateOTPForPhone = async (req, res) => {
    const { phoneNumber } = req.body;
    console.log("🚀 ~ generateOTPForPhone ~ req.body:", req.body);

    try {
        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        const phoneExists = await User.getUserByPhoneNumber(phoneNumber);
        if (phoneExists) {
            return res.status(400).json({ message: "Phone number is already registered" });
        }

        const otp = generateOTP();
        console.log("Generated OTP:", otp);

        const expirationTime = new Date().getTime() + 5 * 60 * 1000;

        // Temporarily store OTP and expiration time in session
        req.session.otp = otp;
        req.session.expirationTime = expirationTime;

        console.log("OTP stored in session:", req.session);
        console.log("Session ID:", req.sessionID);

        return res.status(200).json({
            success: true,
            message: "OTP generated successfully",
            otp: otp,
        });
    } catch (err) {
        return res.status(400).json({ message: "Error generating OTP", error: err.message });
    }
};





const signupUser = async (req, res) => {
    const { phoneNumber, name, email, otp: otpFromBody } = req.body;

    try {
        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        const existingUser = await User.getUserByPhoneNumber(phoneNumber);

        if (!existingUser) {
            // New User Signup
            if (!otpFromBody) {
                return res.status(400).json({ message: "OTP is required for new user signup" });
            }

            const otp = parseInt(otpFromBody, 10);

            if (!req.session || !req.session.otp || !req.session.expirationTime) {
                return res.status(400).json({ message: "Invalid session or OTP not generated" });
            }

            if (req.session.otp !== otp) {
                return res.status(400).json({ message: "Invalid OTP" });
            }

            if (req.session.expirationTime < new Date().getTime()) {
                return res.status(400).json({ message: "OTP has expired" });
            }

            const userInfo = await User.createUser(phoneNumber, name || null, email || null);

            if (!userInfo || !userInfo.insertId) {
                return res.status(500).json({ message: "Failed to create user" });
            }

            delete req.session.otp;
            delete req.session.expirationTime;

            const token = jwt.sign(
                { userId: userInfo.insertId, name, email }, // Payload containing user details
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                success: true,
                data: {
                    phoneNumber,
                    userId: userInfo.insertId,
                    name,
                    email,
                    token,
                },
                message: "User signup success",
            });
        } else {
            // Existing user: Update details if provided
            const updatedName = name || existingUser.name;
            const updatedEmail = email || existingUser.email;

            // if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|email\.com)$/.test(email)) {
            //     return res.status(400).json({ message: "Email must be from gmail.com or email.com" });
            // }

            await User.updateUser(phoneNumber, updatedName, updatedEmail);

            const token = jwt.sign(
                { userId: existingUser.id, name: updatedName, email: updatedEmail },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                success: true,
                message: "User profile updated successfully",
                data: {
                    phoneNumber,
                    userId: existingUser.id,
                    name: updatedName,
                    email: updatedEmail,
                    token,
                },
            });
        }
    } catch (err) {
        return res.status(500).json({ message: "Database error", error: err.message });
    }
};


module.exports = { generateOTPForPhone, signupUser };
