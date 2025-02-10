const db = require("../config/db");

const validatePhone = async (req, res, next) => {
    const { phoneNumber, email } = req.body;
    
    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
    }
    
    if (!/^\d{10}$/.test(phoneNumber)) {
        return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    // const query = 'SELECT * FROM users WHERE email = ?'; // Replace `users` with your table name
    // const [results] = await db.query(query, [email]); // Use your database connection to execute the query

    // if (results.length > 0) {
    //     return res.status(400).json({ message: "Email already exists in the database" });
    // }

    next(); // Proceed to the next middleware or route handler
};



module.exports = { validatePhone };
