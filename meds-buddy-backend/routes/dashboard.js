const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/status/:user_id', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const sql = `
    SELECT m.id AS medication_id, m.name, m.dosage, m.frequency,
           COALESCE(l.taken, 0) AS taken
    FROM medications m
    LEFT JOIN medication_logs l
      ON m.id = l.medication_id AND l.date = ?
    WHERE m.user_id = ?
  `;
  db.all(sql, [today, req.params.user_id], (err, rows) => {
    if (err) return res.status(500).json({ err: err.message });
    res.json(rows);
  });
});

router.get('/adherence/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const sql = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN taken = 1 THEN 1 ELSE 0 END) as taken
    FROM medication_logs ml
    JOIN medications m ON ml.medication_id = m.id
    WHERE m.user_id = ?
  `;

  db.get(sql, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    const taken = row.taken || 0;
    const total = row.total || 0;
    const missed = total - taken;
    
    const remaining = 0; 

    res.json({ taken, missed, remaining }); 
  });
});

module.exports = router;