const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/users',(req,res)=>{
  const sql = `
  SELECT * 
  FROM users`;
  db.all(sql,(err,rows)=>{
    if (err) return res.status(500).json({ err: err.message });
    res.json(rows)
  });
});

router.get('/patients/:caretaker_id', (req, res) => {
  const sql = `
    SELECT u.id, u.name
    FROM caretaker_patients cp
    JOIN users u ON cp.patient_id = u.id
    WHERE cp.caretaker_id = ?
  `;
  db.all(sql, [req.params.caretaker_id], (err, rows) => {
    if (err) return res.status(500).json({ err: err.message });
    res.json(rows);
  });
});

router.post('/caretaker-patient', (req, res) => {
  const { caretaker_id, patient_id } = req.body;

  if (!caretaker_id || !patient_id) {
    return res.status(400).json({ message: 'Both caretaker_id and patient_id are required' });
  }

  const sql = `
    INSERT INTO caretaker_patients (caretaker_id, patient_id)
    VALUES (?, ?)
  `;
  db.run(sql, [caretaker_id, patient_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: 'Relationship created successfully' });
  });
});


// GET /medication-logs-with-caretaker/:caretaker_id
router.get('/medication-logs-with-caretaker/:caretaker_id', (req, res) => {
  const caretakerId = req.params.caretaker_id;

  const sql = `
    SELECT 
      cp.caretaker_id,
      cp.patient_id,
      u.name,
      m.id AS medication_id,
      m.name AS medication_name,
      ml.id AS log_id,
      ml.date,
      ml.taken
    FROM caretaker_patients cp
    JOIN users u ON u.id = cp.patient_id
    JOIN medications m ON m.user_id = u.id
    JOIN medication_logs ml ON ml.medication_id = m.id
    WHERE cp.caretaker_id = ?
    ORDER BY ml.date DESC
    LIMIT 10
  `;

  db.all(sql, [caretakerId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/medication-logs/:patient_id', (req, res) => {
  const patientId = req.params.patient_id;

  const sql = `
    SELECT 
      ml.date,
      ml.taken
    FROM medications m
    JOIN medication_logs ml ON ml.medication_id = m.id
    WHERE m.user_id = ?
    ORDER BY ml.date DESC
  `;

  db.all(sql, [patientId], (err, rows) => {
    if (err) {
      console.error('Error fetching logs by patient_id:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});


// router.get('/medication-logs/:caretaker_id', (req, res) => {
//   const caretakerId = req.params.caretaker_id;

//   const sql = `
//     SELECT 
//       ml.date,
//       ml.taken
//     FROM caretaker_patients cp
//     JOIN users u ON u.id = cp.patient_id
//     JOIN medications m ON m.user_id = u.id
//     JOIN medication_logs ml ON ml.medication_id = m.id
//     WHERE cp.caretaker_id = ?
//     ORDER BY ml.date DESC
//   `;

//   db.all(sql, [caretakerId], (err, rows) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(rows);
//   });
// });


module.exports = router;