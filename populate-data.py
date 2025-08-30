import sqlite3

# Connect to the database
DB_PATH = "sensitive_data_log.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# # Add the 'name' column to the 'flagged_data' table (if it doesn't already exist)
cursor.execute("""
    ALTER TABLE flagged_data
    ADD COLUMN name TEXT;
""")
conn.commit()

# Create the 'flagged_data' table if it does not exist
cursor.execute("""
    CREATE TABLE IF NOT EXISTS flagged_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        data_type TEXT NOT NULL,
        count INTEGER DEFAULT 1,
        last_flagged TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
""")
conn.commit()

# Insert dummy data into the flagged_data table (no need to manually provide timestamp)
dummy_data = [
    ('Alice', 'NRIC', 5),
    ('Bob', 'API_KEY', 3),
    ('Charlie', 'SALARY', 2),
    ('Diana', 'FIN', 7),
    ('Eve', 'PHONE', 4),
]

# Insert the dummy data into the flagged_data table with CURRENT_TIMESTAMP
for data in dummy_data:
    name, data_type, count = data
    cursor.execute("""
        INSERT INTO flagged_data (name, data_type, count, last_flagged) 
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    """, (name, data_type, count))

# Commit the changes to the database
conn.commit()

# Verify the data insertion
cursor.execute("SELECT * FROM flagged_data")
rows = cursor.fetchall()

# Print out the data to verify
print("Data in 'flagged_data' table:")
for row in rows:
    print(row)

# Close the connection
conn.close()
