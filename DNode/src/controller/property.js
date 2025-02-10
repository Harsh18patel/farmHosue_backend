const propertyModel = require("../models/property");
const { convertBlobImageToWebP, saveWebPImageToDisk, convertToWebPBuffer } = require("../utils/imageUtils");
const multer = require('multer');
const storage = multer.memoryStorage();  // Store uploaded file in memory
const upload = multer({ storage: storage });


const createProperties = async (req, res) => {
    const {
        propertyID, 
        property_name, property_sqft, property_type, property_description,
        property_mrp, property_price, check_in, check_out, number_of_guests, per_guest_price, bed,
        day_capacity, night_capacity, location, phone_number, rating, city 
    } = req.body;

    if (!propertyID,!property_name || !property_sqft || !property_type || !property_description) {
        return res.status(400).json({ message: "Required fields are missing" });
    }

    try {
        let imagePaths = [];

        // Handle Base64 image (if provided)
        if (req.body.property_images) {
            const base64Data = req.body.property_images.replace(/^data:image\/[a-zA-Z]*;base64,/, ''); // Strip out the base64 prefix
            const imageBuffer = Buffer.from(base64Data, 'base64');
            const webpImageBuffer = await convertToWebPBuffer(imageBuffer);
            const imagePath = await saveWebPImageToDisk(webpImageBuffer, propertyID, 1);
            imagePaths.push({ path: imagePath });  // Wrap the image path in an object
        }

        // Handle direct file upload (using multer)
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const imageBuffer = file.buffer;
                const webpImageBuffer = await convertToWebPBuffer(imageBuffer);
                const imagePath = await saveWebPImageToDisk(webpImageBuffer, propertyID, i + 1);
                imagePaths.push({ path: imagePath });
            }
        }

        // Prepare the property data to be inserted into the database
        const propertyData = {
            propertyID, property_name, property_sqft, property_type, property_description,
            property_images: JSON.stringify(imagePaths), // Store the file paths as JSON with each path inside an object
            property_mrp, property_price, check_in, check_out, number_of_guests, per_guest_price, bed,
            day_capacity, night_capacity, location, phone_number, rating, city
        };

        const result = await propertyModel.createProperty(propertyData);

        res.status(201).json({
            message: "Property created successfully",
            data: { 
                id: result.insertId, // Add the generated ID to the response
                ...propertyData, 
                property_images: JSON.parse(propertyData.property_images) // Parse JSON and return images in the desired format
            }
        });
    } catch (error) {
        console.error("Error creating property:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Duplicate property ID" });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};






const getPropertyType = async (req,res)=>{
    const { type } = req.query;
    
    try {
        let query = "SELECT * FROM properties";
        let queryParams = [];

        if (type) {
            query += " WHERE property_type = ?";
            queryParams.push(type);
        }

        const properties = await propertyModel.getProperties(query, queryParams);
        console.log("🚀 ~ getPropertyType ~ properties:", properties)

        res.status(200).json({
            success: true,
            data: properties,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }

}


const favoriteProperty = async(req,res)=>{
    const { propertyID } = req.body;
    const user_id = req.userDetail.userId;

    if (!propertyID) {
        return res.status(400).json({ message: 'Property ID is required' });
    }

    try {
        const checkExisting = await propertyModel.checkIfFavorite(user_id, propertyID);

        if (checkExisting.length > 0) {
            return res.status(400).json({ message: 'Property is already in your favorites' });
        }

        const insertFavorite = await propertyModel.addToFavorites(user_id, propertyID);

        return res.status(201).json({
            success: true,
            message: 'Property added to favorites successfully',
            data: {
                user_id,
                propertyID
            }
        });

    } catch (err) {
        console.error("Error adding property to favorites:", err);
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
}



module.exports = { createProperties, getPropertyType, favoriteProperty, upload };
