require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


 app.use(cors({
  origin: ["https://meeting-scheduler-eight-cyan.vercel.app", "http://localhost:5173"],
  credentials: true
}))

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Connection error:', err));

const User = require('./models/User');
const MeetingSpace = require('./models/MeetingSpace');
const Meeting = require('./models/Meeting');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

// Generate a short random code
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ---------- SIGNUP ----------
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- LOGIN ----------
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- CREATE MEETING SPACE ----------
app.post('/space/create', authMiddleware, async (req, res) => {
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
app.post('/space/join', authMiddleware, async (req, res) => {
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

// ---------- GET A SINGLE SPACE  ----------
app.get('/space/:id', authMiddleware, async (req, res) => {
  try {
    const space = await MeetingSpace.findById(req.params.id).populate('members', 'name');
    if (!space) return res.status(404).json({ error: 'Space not found' });
    res.json(space);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- CREATE MEETING ----------
app.post('/meeting/create', authMiddleware, async (req, res) => {
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
app.get('/space/:id/meetings', authMiddleware, async (req, res) => {
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