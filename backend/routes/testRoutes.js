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
// Destination Enquiry Route
router.post("/enquiry", (req, res) => {

    console.log("========== NEW TRAVEL ENQUIRY ==========");
    console.log(req.body);
    console.log("=========================================");
    fetch("http://localhost:5000/api/enquiry", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(enquiry)
})
.then(function(response) {
  return response.json();
})
.then(function(data) {
  console.log("Response from Backend:");
  console.log(data);
})
.catch(function(error) {
  console.error("Error connecting to backend:", error);
});

    res.json({
        success: true,
        message: "Enquiry received successfully!"
    });

});

module.exports = router;