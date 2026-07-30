require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ["https://meeting-scheduler-eight-cyan.vercel.app"],
  credentials: true
}))
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Connection error:', err));

const User = require('./models/User');
const MeetingSpace = require('./models/MeetingSpace');
const Meeting = require('./models/Meeting');

// Generate a short random code, e.g. "A3F9K2"
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ---------- LOGIN ----------
app.post('/login', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    let user = await User.findOne({ name });
    if (!user) {
      user = await User.create({ name });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- CREATE MEETING SPACE ----------
app.post('/space/create', async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) return res.status(400).json({ error: 'name and userId required' });

    const code = generateCode();
    const space = await MeetingSpace.create({ name, code, members: [userId] });

    res.json(space);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- JOIN MEETING SPACE ----------
app.post('/space/join', async (req, res) => {
  try {
    const { code, userId } = req.body;
    if (!code || !userId) return res.status(400).json({ error: 'code and userId required' });

    const space = await MeetingSpace.findOne({ code });
    if (!space) return res.status(404).json({ error: 'No space found with that code' });

    if (!space.members.includes(userId)) {
      space.members.push(userId);
      await space.save();
    }

    res.json(space);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- GET A SINGLE SPACE (with populated member names) ----------
app.get('/space/:id', async (req, res) => {
  try {
    const space = await MeetingSpace.findById(req.params.id).populate('members', 'name');
    if (!space) return res.status(404).json({ error: 'Space not found' });
    res.json(space);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- CREATE MEETING ----------
app.post('/meeting/create', async (req, res) => {
  try {
    const { spaceId, title, datetime } = req.body;
    if (!spaceId || !title || !datetime) {
      return res.status(400).json({ error: 'spaceId, title, and datetime required' });
    }

    const meeting = await Meeting.create({ spaceId, title, datetime });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- GET ALL MEETINGS FOR A SPACE ----------
app.get('/space/:id/meetings', async (req, res) => {
  try {
    const meetings = await Meeting.find({ spaceId: req.params.id }).sort({ datetime: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
 console.log('Server running on port ' + process.env.PORT);
});