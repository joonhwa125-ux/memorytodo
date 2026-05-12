// MongoDB(halilapp) 안의 데이터를 컬렉션별로 출력한다.
// 사용: node scripts/inspect-db.js

const mongoose = require('mongoose');
const Person = require('../server/models/Person.cjs');
const ImportantDate = require('../server/models/ImportantDate.cjs');
const Intent = require('../server/models/Intent.cjs');
const IntentEvent = require('../server/models/IntentEvent.cjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/halilapp';

function divider(title) {
  const line = '─'.repeat(72);
  console.log(`\n${line}\n  ${title}\n${line}`);
}

function fmt(doc) {
  // Mongoose Document → plain object → JSON pretty
  const obj = doc.toObject ? doc.toObject() : doc;
  return JSON.stringify(obj, null, 2);
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log(`\n[connected] ${MONGO_URI}`);

  const persons = await Person.find().lean();
  divider(`persons  (${persons.length}건)`);
  persons.forEach((p) => console.log(fmt(p)));

  const dates = await ImportantDate.find().lean();
  divider(`important_dates  (${dates.length}건)`);
  dates.forEach((d) => console.log(fmt(d)));

  const intents = await Intent.find().lean();
  divider(`intents  (${intents.length}건)`);
  intents.forEach((i) => console.log(fmt(i)));

  const events = await IntentEvent.find().lean();
  divider(`intent_events  (${events.length}건)`);
  events.forEach((e) => console.log(fmt(e)));

  console.log('');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('[error]', err);
  process.exit(1);
});
