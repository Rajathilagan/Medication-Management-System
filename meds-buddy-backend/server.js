const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const db = require('./db');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const caretakerRoutes = require('./routes/caretaker');
const authenticateToken = require('./middleware/authMiddleware');
const patientRoutes = require('./routes/patient');
const medicationRoutes = require('./routes/medication');
const medicationAdherenceRoutes = require('./routes/medicationAdherence')

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Public routes
app.use('/api', authRoutes);

// Protected routes
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/caretaker', authenticateToken, caretakerRoutes);
app.use('/api', medicationRoutes);
app.use('/api/patient', authenticateToken, patientRoutes);
app.use('/api', medicationAdherenceRoutes);

cron.schedule('59 23 * * *', () => {
  const today = new Date().toISOString().split('T')[0];
  const sql = `
    INSERT INTO medication_logs (medication_id, date, taken)
    SELECT m.id, ?, 0
    FROM medications m
    WHERE NOT EXISTS (
      SELECT 1 FROM medication_logs l
      WHERE l.medication_id = m.id AND l.date = ?
    )
  `;

  db.run(sql, [today, today], function (err) {
    if (err) {
      console.error('[CRON] Failed to insert missed logs:', err.message);
    } else {
      console.log('[CRON] Missed medications logged at 11:59 PM');
    }
  });
});


// Example protected route
app.get('/api/test-protected', authenticateToken, (req, res) => {
  res.json({ message: '✅ You are authenticated', user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));