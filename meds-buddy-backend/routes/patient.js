const express = require('express');
const router = express.Router();
const db = require('../db');

// Add a daily medication log for a patient
router.post('/medication-logs', (req, res) => {
  const { medication_id, date, taken } = req.body;

  if (!medication_id || !date || typeof taken !== 'number') {
    return res.status(400).json({ message: 'All fields (medication_id, date, taken) are required' });
  }

  const sql = `
    INSERT INTO medication_logs (medication_id, date, taken)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [medication_id, date, taken], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Log added', id: this.lastID });
  });
});


// router.post('/update-daily',(req, res) => {
//   const { medication_id, date, taken } = req.body;

//   if (!medication_id || !date) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   const sql = `
//     INSERT INTO medication_logs (medication_id, date, taken)
//     VALUES (?, ?, ?)
//     ON CONFLICT(medication_id, date) DO UPDATE SET taken = excluded.taken
//   `;

//   db.run(sql, [medication_id, date, taken ? 1 : 0], function (err) {
//     if (err) {
//       console.error(err.message);
//       return res.status(500).json({ message: 'Failed to update medication log' });
//     }
//     res.json({ message: 'Medication log updated successfully' });
//   });
// });

module.exports = router;