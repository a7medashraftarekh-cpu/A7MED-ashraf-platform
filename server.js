const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Block sensitive files from being served as static
const BLOCKED_FILES = ['.env', 'server.js', 'auth.js', 'courses.js', 'exams.js',
  'Course.js', 'Exam.js', 'User.js', 'package.json', 'package-lock.json'];

app.use((req, res, next) => {
  if (BLOCKED_FILES.some(f => req.path.includes(f))) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
});

// Serve static client files
app.use(express.static(__dirname));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/a7med_lms';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// API Routes
app.use('/api/auth', require('./auth'));
app.use('/api/courses', require('./courses'));
app.use('/api/exams', require('./exams'));

// Catch-All for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 A7MED Ashraf LMS running on port ${PORT}`));
