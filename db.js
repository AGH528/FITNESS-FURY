require('dotenv').config();
const mongoose = require('mongoose');

const connectToMongoDB = async () => {
  try {
   
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Successfully connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = connectToMongoDB;
