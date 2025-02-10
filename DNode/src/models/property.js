const db = require("../config/db");

const createProperty = (propertyData) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO properties 
            (propertyID, property_name, property_sqft, property_type, property_description, 
            property_images, property_mrp, property_price, number_of_guests, check_in, check_out,
            per_guest_price, bed, day_capacity, night_capacity, location, 
            phone_number, rating, city) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const { propertyID, property_name, property_sqft, property_type, property_description, 
            property_images, property_mrp, property_price, number_of_guests, 
            check_in, check_out, per_guest_price, bed, day_capacity, night_capacity, 
            location, phone_number, rating, city } = propertyData;
        
        const checkIn = check_in || null;
        const checkOut = check_out || null;

        db.query(sql, [
            propertyID, property_name, property_sqft, property_type, property_description, 
            property_images, property_mrp, property_price, number_of_guests, checkIn, checkOut, 
            per_guest_price, bed, day_capacity, night_capacity, location, 
            phone_number, rating, city
        ], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const getProperties = (query, queryParams) => {
    return new Promise((resolve, reject) => {
        db.query(query, queryParams, (err, results) => {
            if (err) reject(err);
            const formattedResults = results.map(property => {
                if (property.property_images) {
                    const imagePaths = JSON.parse(property.property_images);
                    return {
                        ...property,
                        property_images: imagePaths.map((image, index) => ({
                            path: `/images/${property.propertyID}[${index + 1}].webp`
                        }))
                    };
                }
                return property;
            });

            resolve(formattedResults);
        });
    });
};

const getPropertyByID = (propertyID) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM properties WHERE propertyID = ?';
        db.query(query, [propertyID], (err, result) => {
            if (err) reject(err);
            resolve(result[0]); // Return the first match, or null if not found
        });
    });
};

const checkIfFavorite = async (user_id, propertyID) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM favourites WHERE user_id = ? AND propertyID = ?';
        db.query(query, [user_id, propertyID], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const addToFavorites = async (user_id, propertyID) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO favourites (user_id, propertyID) VALUES (?, ?)';
        db.query(query, [user_id, propertyID], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const getMaxPropertyID = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT MAX(propertyID) AS maxID FROM properties';
        db.query(query, (err, result) => {
            if (err) reject(err);
            resolve(result[0].maxID || 0); // Return 0 if no properties exist
        });
    });
};


module.exports = { createProperty, getProperties, getPropertyByID, checkIfFavorite, addToFavorites, getMaxPropertyID };
