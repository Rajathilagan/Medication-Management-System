const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Get all medications for a patient
router.get('/medications', (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: 'user_id is required' });

  const sql = `SELECT * FROM medications WHERE user_id = ?`;
  db.all(sql, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ✅ Add new medication
router.post('/medications', (req, res) => {
  const { user_id, name, dosage, frequency } = req.body;
  if (!user_id || !name || !dosage || !frequency) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `
    INSERT INTO medications (user_id, name, dosage, frequency)
    VALUES (?, ?, ?, ?)
  `;
  db.run(sql, [user_id, name, dosage, frequency], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});


// ✅ Update medication
router.put('/medications/:id', (req, res) => {
  const { id } = req.params;
  const { name, dosage, frequency } = req.body;

  const sql = `
    UPDATE medications SET name = ?, dosage = ?, frequency = ?
    WHERE id = ?
  `;
  db.run(sql, [name, dosage, frequency, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Medication updated' });
  });
});

// ✅ Delete medication
router.delete('/medications/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM medications WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Medication deleted' });
  });
});

router.get('/medication-logs/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT l.*, m.name AS medication_name
    FROM medication_logs l
    JOIN medications m ON l.medication_id = m.id
    WHERE l.user_id = ?
    ORDER BY l.date DESC
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error('Failed to fetch medication logs:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

router.post('/medications/:id/mark', (req, res) => {
  const { id } = req.params;
  const today = new Date().toISOString().split('T')[0];

  const sql = `
    INSERT INTO medication_logs (medication_id, date, taken)
    VALUES (?, ?, 1)
    ON CONFLICT(medication_id, date) DO UPDATE SET taken = 1
  `;

  db.run(sql, [id, today], function (err) {
    if (err) {
      console.error('Mark error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Marked as taken' });
  });
});

module.exports = router;












// const express = require('express');
// const router = express.Router();
// const db = require('../db');

// // Get medication logs for a patient (for recent activity & calendar)
// router.get('/medication-logs/:userId', (req, res) => {
//   const { userId } = req.params;
//   const sql = `
//     SELECT m.name, m.dosage, l.date, l.taken
//     FROM medication_logs l
//     JOIN medications m ON m.id = l.medication_id
//     WHERE m.user_id = ?
//     ORDER BY l.date DESC
//     LIMIT 10
//   `;
//   db.all(sql, [userId], (err, rows) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(rows);
//   });
// });

// // Get adherence data (for overview)
// router.get('/adherence/:userId', (req, res) => {
//   const { userId } = req.params;
//   const sql = `
//     SELECT 
//       SUM(CASE WHEN taken = 1 THEN 1 ELSE 0 END) AS taken,
//       SUM(CASE WHEN taken = 0 THEN 1 ELSE 0 END) AS missed,
//       (SELECT COUNT(*) FROM medications WHERE user_id = ?) * 30 
//         - COUNT(*) AS remaining
//     FROM medication_logs l
//     JOIN medications m ON l.medication_id = m.id
//     WHERE m.user_id = ?
//   `;
//   db.get(sql, [userId, userId], (err, row) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(row);
//   });
// });

// // Update medication taken status for today
// router.put('/log/:medicationId', (req, res) => {
//   const { medicationId } = req.params;
//   const { date, taken } = req.body;

//   const sql = `
//     INSERT INTO medication_logs (medication_id, date, taken)
//     VALUES (?, ?, ?)
//     ON CONFLICT(medication_id, date) DO UPDATE SET taken = excluded.taken
//   `;
//   db.run(sql, [medicationId, date, taken], function (err) {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: 'Log updated', id: this.lastID });
//   });
// });

// module.exports = router;
