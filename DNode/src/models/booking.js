const db = require('../config/db'); // Your DB connection

const createBooking = (bookingData) => {
    return new Promise((resolve, reject) => {
        const { bookingID, booking_date, check_in, check_out, user_id, propertyID, booking_amount, booking_person,	
            booking_guest } = bookingData;
        
        const query = `
            INSERT INTO bookings (bookingID, booking_date, check_in, check_out, user_id, propertyID, booking_amount, booking_person,	
booking_guest)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
        `;
        
        const values = [
            bookingID,
            booking_date,
            check_in,
            check_out,
            user_id,
            propertyID,
            booking_amount,
            booking_person,
            booking_guest
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Function to get property details for a given propertyID
const getPropertyDetails = (propertyID) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT property_mrp, property_price, number_of_guests FROM properties WHERE propertyID = ?';
        db.query(query, [propertyID], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = {createBooking,getPropertyDetails};
