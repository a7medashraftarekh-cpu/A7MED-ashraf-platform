const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, default: 30 },
  questions: [{
    text: String,
    options: [String],
    correctAnswer: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);
