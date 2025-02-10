const { Property } = require('../models/search'); // Access Property
const { PropertyByName } = require('../models/search'); // Access PropertyByName


const searchProperty = async (req, res) => {
    const { check_in, check_out, city } = req.body;
    console.log("🚀 ~ searchProperty ~ req.body:", req.body);

    if (!check_in || !check_out || !city) {
        return res.status(400).json({ message: "Check-in, check-out, and city are required" });
    }

    try {
        const availableProperties = await Property.searchProperties(city, check_in, check_out);
        console.log("🚀 ~ searchProperty ~ availableProperties:", availableProperties)

        if (availableProperties.length === 0) {
            return res.status(404).json({ message: "No available properties found for the selected dates" });
        }

        return res.status(200).json({
            success: true,
            message: "Available properties retrieved successfully",
            data: availableProperties
        });

    } catch (err) {
        console.error("Error in search API:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};





const searchByName = async (req, res) => {
    const { property_name } = req.body;
    console.log("🚀 ~ searchByName ~ req.body:", req.body);

    if (!property_name) {
        return res.status(400).json({ message: "Property name is required" });
    }

    try {
        const properties = await PropertyByName.searchByName(property_name);

        if (properties.length === 0) {
            return res.status(404).json({ message: "No matching properties found" });
        }

        return res.status(200).json({
            success: true,
            message: "Properties retrieved successfully",
            data: properties
        });

    } catch (err) {
        console.error("Error in property search API:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};


module.exports = { searchProperty, searchByName };