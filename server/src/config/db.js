import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();
      console.log('Using in-memory MongoDB for ZeroFoodWaste development');
    }

    await mongoose.connect(mongoUri, {
      dbName: 'zerofoodwaste',
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
