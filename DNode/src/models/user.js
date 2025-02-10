const db = require("../config/db");


const getUserByPhoneNumber = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE phoneNumber = ?";
        db.query(sql, [phoneNumber], (err, result) => {
            if (err) reject(err);
            else resolve(result.length > 0 ? result[0] : null);
        });
    });
};


const createUser = (phoneNumber, name, email) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO users (phoneNumber, name, email) VALUES (?, ?, ?)";
        db.query(sql, [phoneNumber, name, email], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};


const updateUser = (phoneNumber, name, email) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE users SET name = ?, email = ? WHERE phoneNumber = ?";
        db.query(sql, [name, email, phoneNumber], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};


module.exports = { createUser, updateUser, getUserByPhoneNumber };
