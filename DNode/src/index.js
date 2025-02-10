require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const propertyRoutes = require("./routes/property")
const bookingRoutes = require("./routes/booking")
const reviewRoutes = require("./routes/review")
const searchRoutes = require("./routes/search")
const db = require("./config/db");
const session = require('express-session');

const app = express();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 300000 }
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use Routes
app.use("/user", userRoutes);
app.use("/property", propertyRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);
app.use("/search", searchRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
