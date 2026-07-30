const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  spaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'MeetingSpace', required: true },
  title: { type: String, required: true },
  datetime: { type: Date, required: true },
});

module.exports = mongoose.model('Meeting', meetingSchema);