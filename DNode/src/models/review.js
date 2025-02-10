const db = require('../config/db'); // Database connection

// Function to check if the user has already reviewed the property
const checkExistingReview = (user_id, propertyID) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM reviews WHERE user_id = ? AND propertyID = ?';
        db.query(query, [user_id, propertyID], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Function to insert a new review
const addReview = (user_id, propertyID, description, rating) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO reviews (user_id, propertyID, description, rating)
            VALUES (?, ?, ?, ?)
        `;
        const reviewData = [user_id, propertyID, description, rating];
        db.query(query, reviewData, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = {
    checkExistingReview,
    addReview
};
