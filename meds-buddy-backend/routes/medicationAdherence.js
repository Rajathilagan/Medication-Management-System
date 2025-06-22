const express = require('express');
const router = express.Router();
const db = require('../db');
const dayjs = require('dayjs');

router.get('/adherence/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const now = new Date(); 
  const year = now.getFullYear();
  const month = now.getMonth(); 
  const today = now.getDate(); 

  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const remaining = totalDaysInMonth - today;

  const startOfMonth = new Date(year, month, 1).toISOString().split('T')[0]; // 2025-06-01
  const todayDate = new Date(year, month, today).toISOString().split('T')[0]; // 2025-06-20

  const sql = `
    SELECT ml.taken
    FROM medication_logs ml
    JOIN medications m ON ml.medication_id = m.id
    WHERE m.user_id = ? AND ml.date BETWEEN ? AND ?
  `;

  db.all(sql, [userId, startOfMonth, todayDate], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const taken = rows.filter(r => r.taken === 1).length;
    const missed = rows.filter(r => r.taken === 0).length;

    const adherencePercentage = (taken + missed) > 0
      ? Math.round((taken / (taken + missed)) * 100)
      : 0;

    res.json({
      taken,
      missed,
      remaining,
      adherencePercentage
    });
  });
});


router.get('/streak/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const sql = `
    SELECT ml.date, ml.taken
    FROM medication_logs ml
    JOIN medications m ON ml.medication_id = m.id
    WHERE m.user_id = ?
    ORDER BY ml.date DESC
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    let streak = 0;
    let today = new Date();
    
    for (let row of rows) {
      const logDate = new Date(row.date);
      const diffDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 && row.taken === 1) {
        streak++;
      } else if (diffDays === streak && row.taken === 1) {
        streak++;
      } else if (diffDays > streak || row.taken === 0) {
        break;
      }
    }

    res.json({ streak });
  });
});

router.get('/missed-this-month/:user_id', (req, res) => {
  const sql = `
    SELECT COUNT(*) as missed
    FROM medication_logs ml
    JOIN medications m ON ml.medication_id = m.id
    WHERE m.user_id = ? AND ml.taken = 0
      AND strftime('%Y-%m', ml.date) = strftime('%Y-%m', 'now')
  `;
  db.get(sql, [req.params.user_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ missed: row.missed });
  });
});

router.get('/taken-this-week/:user_id', (req, res) => {
  const sql = `
    SELECT COUNT(*) as taken
    FROM medication_logs ml
    JOIN medications m ON ml.medication_id = m.id
    WHERE m.user_id = ?
      AND ml.taken = 1
      AND date(ml.date) >= date('now', '-6 days')
  `;
  db.get(sql, [req.params.user_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ taken: row.taken });
  });
});


module.exports = router;