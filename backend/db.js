const mysql = require("mysql2");

// Create Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pinchi@9599",
    database: "tripden"
});

// Connect
db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("Connected to MySQL Database");
    }
});

module.exports = db;