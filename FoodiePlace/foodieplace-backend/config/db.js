const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI; // Prioritize MONGODB_URI as per README

    if (!uri) {
      throw new Error('MongoDB connection string is missing in .env');
    }

    const conn = await mongoose.connect(uri, {
      // Recommended options for modern Mongoose and Atlas
      // useNewUrlParser: true, // Deprecated in Mongoose 6+
      // useUnifiedTopology: true, // Deprecated in Mongoose 6+
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;