const reviewModel = require('../models/review');


const reviewProperty = async(req,res)=>{
    const { propertyID, rating, description } = req.body;
    const user_id = req.userDetail.userId;

    if (!propertyID || !rating || !description) {
        return res.status(400).json({ message: "PropertyID, rating, and description are required" });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    try {
        const existingReview = await reviewModel.checkExistingReview(user_id, propertyID);

        if (existingReview.length > 0) {
            return res.status(400).json({ message: "You have already reviewed this property" });
        }

        const result = await reviewModel.addReview(user_id, propertyID, description, rating);

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: {
                user_id,
                propertyID,
                description,
                rating,
            }
        });

    } catch (err) {
        console.error("Error adding review:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

module.exports = {reviewProperty}