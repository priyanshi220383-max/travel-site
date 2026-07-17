const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());

const PORT = 5000;

// Middleware
app.use(express.json());

// Import Routes
const testRoutes = require("./routes/testRoutes");

// Use Routes
app.use("/api", testRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});