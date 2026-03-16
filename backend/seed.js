require('dotenv').config();
const mongoose = require('mongoose');

const EventType = require('./models/EventType');
const User = require('./models/User');

const seedEventTypes = async () => {

  try {

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find first user in database
    const user = await User.findOne();

    if (!user) {
      console.log("No user found. Please register a user first.");
      process.exit(0);
    }

    const eventTypes = [
      { name: 'Meeting', color: '#3b82f6' },
      { name: 'Holiday', color: '#10b981' },
      { name: 'Deadline', color: '#ef4444' },
      { name: 'Personal', color: '#8b5cf6' },
      { name: 'Company Event', color: '#f59e0b' }
    ];

    for (const type of eventTypes) {

      const existing = await EventType.findOne({
        name: type.name,
        user: user._id
      });

      if (!existing) {

        await EventType.create({
          ...type,
          user: user._id
        });

        console.log(`Created event type: ${type.name}`);
      }

    }

    console.log('Seeding completed');
    process.exit(0);

  } catch (error) {

    console.error('Seeding error:', error);
    process.exit(1);

  }

};

seedEventTypes();