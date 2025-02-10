const db = require('../config/db');

const Property = {
    searchProperties: async (city, check_in, check_out) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT p.*, JSON_UNQUOTE(p.property_images) AS property_images
                FROM properties p
                WHERE p.city = ?
                AND p.propertyID NOT IN (
                    SELECT b.propertyID
                    FROM bookings b
                    WHERE (
                        (b.check_in <= ? AND b.check_out >= ?) OR
                        (b.check_in BETWEEN ? AND ?) OR            
                        (b.check_out BETWEEN ? AND ?)            
                    )
                )
            `;

            const params = [city, check_out, check_in, check_in, check_out, check_in, check_out];

            db.query(query, params, (err, results) => {
                if (err) reject(err);
                
                // Transform the results before sending them
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
    }
};



const PropertyByName = {
    searchByName: async (property_name) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT p.*
                FROM properties p
                LEFT JOIN bookings b ON p.propertyID = b.propertyID
                WHERE p.property_name LIKE ? 
                AND b.propertyID IS NULL
            `;
            const params = [`${property_name}%`];
            db.query(query, params, (err, results) => {
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
    }
};

module.exports = { Property, PropertyByName };
