require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

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

/* ---------------- GOOGLE CALENDAR CONFIG ---------------- */

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

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

/* ---------------- GOOGLE CALENDAR AUTH ---------------- */

app.get('/api/auth/google', authenticateToken, (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: req.user.userId
  });

  res.json({ authUrl: url });
});

app.get('/api/auth/google/callback', async (req, res) => {
  const { code, state: userId } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user's calendar list to find primary calendar
    const calendarResponse = await calendar.calendarList.list();
    const primaryCalendar = calendarResponse.data.items.find(cal => cal.primary);

    // Save tokens to user
    await User.findByIdAndUpdate(userId, {
      googleCalendar: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: new Date(tokens.expiry_date),
        calendarId: primaryCalendar ? primaryCalendar.id : 'primary'
      }
    });

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/calendar?google_auth=success`);
  } catch (error) {
    console.error('Google auth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/calendar?google_auth=error`);
  }
});

app.get('/api/google-calendar/events', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user.googleCalendar || !user.googleCalendar.accessToken) {
      return res.status(400).json({ message: 'Google Calendar not connected' });
    }

    oauth2Client.setCredentials({
      access_token: user.googleCalendar.accessToken,
      refresh_token: user.googleCalendar.refreshToken,
      expiry_date: user.googleCalendar.expiryDate.getTime()
    });

    const { timeMin, timeMax } = req.query;
    const response = await calendar.events.list({
      calendarId: user.googleCalendar.calendarId || 'primary',
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      date: event.start.dateTime ? event.start.dateTime.split('T')[0] : event.start.date,
      time: event.start.dateTime ? event.start.dateTime.split('T')[1].substring(0, 5) : '00:00',
      location: event.location || '',
      url: event.htmlLink || '',
      category: 'Google Calendar',
      color: '#4285f4',
      isGoogleEvent: true
    }));

    res.json(events);
  } catch (error) {
    console.error('Google Calendar fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch Google Calendar events' });
  }
});

/* ---------------- EVENTS ---------------- */

app.get('/api/events', authenticateToken, async (req, res) => {

  try {

    const events = await Event.find({ user: req.user.userId }).populate('eventType');
    console.log(`Fetched ${events.length} events for user ${req.user.userId}`);

    res.json(events);

  } catch (error) {

    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message });

  }

});

app.post('/api/events', authenticateToken, async (req, res) => {

  try {

    const { title, date, time, location, url, eventType, color } = req.body;
    
    // Validate required fields
    if (!title || !date || !time || !eventType) {
      return res.status(400).json({ message: 'Missing required fields: title, date, time, eventType' });
    }

    // Verify event type exists (event types are global)
    const eventTypeDoc = await EventType.findById(eventType);
    if (!eventTypeDoc) {
      return res.status(400).json({ message: 'Invalid event type' });
    }

    const event = new Event({
      title,
      date,
      time,
      location: location || '',
      url: url || '',
      eventType,
      color: color || eventTypeDoc.color,
      user: req.user.userId
    });

    const newEvent = await event.save();
    await newEvent.populate('eventType');
    
    console.log('Event created successfully:', newEvent);

    res.status(201).json(newEvent);

  } catch (error) {

    console.error('Error creating event:', error);
    res.status(400).json({ message: error.message });

  }

});

app.put('/api/events/:id', authenticateToken, async (req, res) => {

  try {

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    ).populate('eventType');

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

app.get('/api/event-types', authenticateToken, async (req, res) => {

  try {

    // Return all event types so users can see shared ones and their own
    const eventTypes = await EventType.find();
    console.log(`Fetched ${eventTypes.length} event types`);

    res.json(eventTypes);

  } catch (error) {

    console.error('Error fetching event types:', error);
    res.status(500).json({ message: error.message });

  }

});

app.post('/api/event-types', authenticateToken, async (req, res) => {

  try {

    const { name, color } = req.body;
    
    // Validate required fields
    if (!name || !color) {
      return res.status(400).json({ message: 'Missing required fields: name, color' });
    }

    const eventType = new EventType({
      name,
      color,
      user: req.user.userId
    });

    const newEventType = await eventType.save();
    console.log('Event type created successfully:', newEventType);

    res.status(201).json(newEventType);

  } catch (error) {

    console.error('Error creating event type:', error);
    res.status(400).json({ message: error.message });

  }

});

app.delete('/api/event-types/:id', authenticateToken, async (req, res) => {

  try {

    const eventType = await EventType.findById(req.params.id);

    if (!eventType) {
      return res.status(404).json({ message: 'Event type not found' });
    }

    // Only creator can delete
    if (eventType.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only creator can delete this event type' });
    }

    await EventType.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event type deleted' });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

/* ---------------- SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});