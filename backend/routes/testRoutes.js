const express = require("express");

const router = express.Router();

// Test Route
router.get("/test", (req, res) => {
    res.json({
        message: "TripDen Backend is Working!"
    });
});

// Trip Booking Route
router.post("/trip-booking", (req, res) => {

    console.log("========== NEW BOOKING ==========");
    console.log(req.body);
    console.log("=================================");

    res.json({
        success: true,
        message: "Booking received successfully!"
    });

});

module.exports = router;