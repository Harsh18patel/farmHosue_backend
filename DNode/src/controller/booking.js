const bookingModel = require('../models/booking');


const bookingProperty = async (req,res)=>{
    const { bookingID,propertyID, check_in, check_out } = req.body;
    const user_id = req.userDetail.userId;
    const booking_person = req.userDetail.name;

    if (!bookingID, !propertyID || !check_in || !check_out) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {

        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({ message: "Invalid date and time format for check_in or check_out" });
        }

        const propertyResult = await bookingModel.getPropertyDetails(propertyID);

        if (propertyResult.length === 0) {
            return res.status(404).json({ message: "Property not found" });
        }

        const property = propertyResult[0];
        const booking_amount = property.property_price;
        console.log("🚀 ~ bookingProperty ~ booking_amount:", booking_amount)
        const booking_guest = property.number_of_guests;
        console.log("🚀 ~ bookingProperty ~ booking_guest:", booking_guest)

 

        const bookingData = {
            bookingID,
            booking_date: new Date(),
            check_in: checkInDate,
            check_out: checkOutDate,
            user_id,
            propertyID,
            booking_amount,
            booking_person,
            booking_guest,
        };

        const result = await bookingModel.createBooking(bookingData);

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
                booking_person,
                booking_guest,
                check_in: checkInDate.toISOString(),
                check_out: checkOutDate.toISOString(),
                booking_amount,
            }
        });

    } catch (err) {
        console.error("Error creating booking:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}


module.exports = {bookingProperty}