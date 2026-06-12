// Script to view MongoDB data
const mongoose = require('mongoose');
require('dotenv').config();

async function viewData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    console.log('📊 DATABASE: taskmatrix');
    console.log('═'.repeat(60));
    console.log('');
    
    // View data from each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      
      console.log(`📁 Collection: ${collectionName}`);
      console.log(`   Documents: ${count}`);
      
      if (count > 0) {
        const docs = await db.collection(collectionName).find().limit(5).toArray();
        console.log(`   Sample data (first ${Math.min(count, 5)}):`);
        
        docs.forEach((doc, index) => {
          console.log(`\n   [${index + 1}]`, JSON.stringify(doc, null, 2).split('\n').join('\n   '));
        });
      }
      
      console.log('');
      console.log('-'.repeat(60));
      console.log('');
    }
    
    mongoose.connection.close();
    console.log('✅ Disconnected');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

viewData();
