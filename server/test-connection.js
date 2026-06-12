const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
console.log('\nAttempting to connect...\n');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('✅ SUCCESS! MongoDB connected!');
  console.log('✅ Database:', mongoose.connection.db.databaseName);
  process.exit(0);
})
.catch((error) => {
  console.log('❌ CONNECTION FAILED!');
  console.log('\nError Details:');
  console.log('Name:', error.name);
  console.log('Message:', error.message);
  if (error.cause) {
    console.log('\nRoot Cause:', error.cause);
  }
  process.exit(1);
});
