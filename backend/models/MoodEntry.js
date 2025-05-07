const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
  mood: String,
  journal: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);
