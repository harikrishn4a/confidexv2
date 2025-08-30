const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware to parse JSON bodies and handle CORS
app.use(express.json());
app.use(cors());

// Connect to the SQLite database
const DB_PATH = '../sensitive_data_log.db';
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Database opening error: ', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// API Endpoint to fetch all flagged data
app.get('/', (req, res) => {
    db.all('SELECT * FROM flagged_data', (err, rows) => {
      if (err) {
        console.error('Database query error:', err);  // Log the error for debugging
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json(rows);  // Send rows as JSON response
    });
  });
  

// API Endpoint to fetch flagged data by employee name
app.get('/api/flagged-data/:name', (req, res) => {
  const name = req.params.name;
  db.all('SELECT * FROM flagged_data WHERE name = ?', [name], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(rows); // Send rows as JSON response
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
