// Simple MongoDB connection test
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

console.log('Testing with native MongoDB driver...\n');
console.log('URI:', uri.replace(/:[^:@]+@/, ':****@'));
console.log('\nConnecting...\n');

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB!');
    
    const db = client.db('taskmatrix');
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Collections found:');
    collections.forEach(col => console.log('  -', col.name));
    
    await client.close();
    console.log('\n✅ Test successful!');
    process.exit(0);
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('\nError:', error.message);
    console.log('\nError Code:', error.code);
    console.log('\nError Name:', error.name);
    process.exit(1);
  }
}

test();
