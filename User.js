const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  progress: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completed: { type: Boolean, default: false },
    watchedSeconds: { type: Number, default: 0 }
  }],
  examResults: [{
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    score: Number,
    totalQuestions: Number,
    takenAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
