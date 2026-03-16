require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Event = require('./models/Event');
const EventType = require('./models/EventType');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- MONGODB ---------------- */

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

/* ---------------- MIDDLEWARE ---------------- */

app.use(cors());
app.use(express.json());

/* ---------------- AUTH MIDDLEWARE ---------------- */

const authenticateToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();

  });
};

/* ---------------- AUTH ---------------- */

app.post('/api/auth/register', async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

app.post('/api/auth/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

/* ---------------- EVENTS ---------------- */

app.get('/api/events', authenticateToken, async (req, res) => {

  try {

    const events = await Event.find({ user: req.user.userId });

    res.json(events);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

app.post('/api/events', authenticateToken, async (req, res) => {

  try {

    const event = new Event({
      ...req.body,
      user: req.user.userId
    });

    const newEvent = await event.save();

    res.status(201).json(newEvent);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }

});

app.put('/api/events/:id', authenticateToken, async (req, res) => {

  try {

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );

    res.json(event);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }

});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {

  try {

    await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    res.json({ message: 'Event deleted' });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

/* ---------------- EVENT TYPES ---------------- */

app.get('/api/event-types', async (req, res) => {

  try {

    const eventTypes = await EventType.find();

    res.json(eventTypes);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

app.post('/api/event-types', async (req, res) => {

  try {

    const eventType = new EventType(req.body);

    const newEventType = await eventType.save();

    res.status(201).json(newEventType);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }

});

/* ---------------- SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});