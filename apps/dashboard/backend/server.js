import express from "express";

const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Initialize SQLite database
const DB_PATH = "./sensitive_data_log.db";
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Database opening error: ", err);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// Endpoint to log flagged data
app.post("/log-sensitive-data", (req, res) => {
    const { data_type } = req.body;

    if (!data_type) {
        return res.status(400).json({ error: "data_type is required" });
    }

    db.get("SELECT count FROM flagged_data WHERE data_type = ?", [data_type], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Database query error" });
        }

        if (row) {
            // Update existing data_type
            const newCount = row.count + 1;
            db.run(
                "UPDATE flagged_data SET count = ?, last_flagged = CURRENT_TIMESTAMP WHERE data_type = ?",
                [newCount, data_type],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Error updating record" });
                    }
                    res.status(200).json({ message: "Sensitive data logged successfully." });
                }
            );
        } else {
            // Insert new data_type
            db.run(
                "INSERT INTO flagged_data (data_type) VALUES (?)",
                [data_type],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Error inserting record" });
                    }
                    res.status(200).json({ message: "Sensitive data logged successfully." });
                }
            );
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
