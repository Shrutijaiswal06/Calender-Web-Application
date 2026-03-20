require('dotenv').config();
const mongoose = require('mongoose');

// Seed file - no longer creates default event types
// Users can create their own event types through the application

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    console.log("Seeding completed - No default event types created");
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();