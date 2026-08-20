const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'A7MED ashraf',
  password: process.env.ADMIN_PASSWORD || 'Af.12345'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.json({ success: true, token, user: { username, role: 'admin' } });
  }
  res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
});

router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ valid: false });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
