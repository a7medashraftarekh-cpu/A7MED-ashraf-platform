const express = require('express');
const router = express.Router();
const multer = require('multer');
const Course = require('./Course');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', upload.single('video'), async (req, res) => {
  try {
    const { title, description, category, duration } = req.body;
    const course = new Course({
      title,
      description,
      category,
      duration,
      videoUrl: req.file ? `/uploads/${req.file.filename}` : null
    });
    await course.save();
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
