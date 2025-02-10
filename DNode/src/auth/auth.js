const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req?.headers?.["x-token"]; // Bearer <token>
    console.log("🚀 ~ authenticateToken ~ token:", token)

    if (!token) {
        return res.status(400).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("🚀 ~ authenticateToken ~ decoded:", decoded)

        // Attach user information to the request object
        req.userDetail = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token." });
    }
};

module.exports = authenticateToken;
