const express = require("express");
const router = express.Router();
const db = require("../db");

// Test Route
router.get("/test", (req, res) => {
    res.json({
        message: "TripDen Backend is Working!"
    });
});

// =========================
// Trip Booking
// =========================
router.post("/trip-booking", (req, res) => {

    const booking = req.body;

    const sql = `
    INSERT INTO bookings
    (destination,email,fromDate,toDate,agentName,agentContact,agentFee,bookingTime,status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        booking.destination,
        booking.email,
        booking.fromDate,
        booking.toDate,
        booking.agent.name,
        booking.agent.contact,
        booking.agent.fee,
        booking.bookingTime,
        booking.status
    ];

    db.query(sql, values, (err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json({
            success: true,
            message: "Booking saved successfully!"
        });

    });

});

// =========================
// Destination Enquiry
// =========================
router.post("/enquiry", (req, res) => {

    const {
        name,
        phone,
        email,
        travellers,
        startDate,
        destination
    } = req.body;

    const sql = `
    INSERT INTO enquiries
    (name, phone, email, travellers, startDate, destination)
    VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name,
        phone,
        email,
        travellers,
        startDate,
        destination
    ];

    db.query(sql, values, (err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json({
            success: true,
            message: "Enquiry Saved Successfully!"
        });

    });

});

module.exports = router;