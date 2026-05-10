// MongoDB 연결
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/halilapp';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[mongo] connected:', MONGO_URI);
  } catch (err) {
    console.error('[mongo] connect failed:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB, MONGO_URI };
