// MongoDB 연결
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/halilapp';

/**
 * Connection string에서 비밀번호와 cluster 식별자 일부를 마스킹.
 * 로그/공유 시 비밀번호가 평문으로 노출되지 않도록.
 *
 * 예) mongodb+srv://user:Abc123@cluster0.abc12.mongodb.net/db?...
 *  -> mongodb+srv://user:****@cluster0.****.mongodb.net/db?...
 */
function maskUri(uri) {
  return uri
    .replace(/:([^:@/]+)@/, ':****@')        // 비밀번호
    .replace(/@([^.]+)\.[^.]+\.mongodb\.net/, '@$1.****.mongodb.net'); // cluster id 일부
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[mongo] connected:', maskUri(MONGO_URI));
  } catch (err) {
    console.error('[mongo] connect failed:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB, MONGO_URI, maskUri };
