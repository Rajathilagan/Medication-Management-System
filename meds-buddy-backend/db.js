require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, process.env.DATABASE_FILE || 'data.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('DB Error:', err.message);
  else console.log('Connected to SQLite:', dbPath);
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('patient', 'caretaker'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS medications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS medication_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medication_id INTEGER,
      date TEXT NOT NULL,
      taken INTEGER DEFAULT 0,
      FOREIGN KEY(medication_id) REFERENCES medications(id)
    )
  `);


  db.run(`
    CREATE TABLE IF NOT EXISTS caretaker_patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caretaker_id INTEGER,
      patient_id INTEGER,
      FOREIGN KEY(caretaker_id) REFERENCES users(id),
      FOREIGN KEY(patient_id) REFERENCES users(id)
    )
  `);

  db.run(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_medication_logs_unique
  ON medication_logs (medication_id, date)
`);
});

module.exports = db;