const express = require('express');
const router = express.Router();
const MoodEntry = require('../models/MoodEntry');

// POST mood entry
router.post('/add', async (req, res) => {
  try {
    const newEntry = new MoodEntry(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all mood entries
router.get('/all', async (req, res) => {
  try {
    const entries = await MoodEntry.find().sort({ timestamp: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
