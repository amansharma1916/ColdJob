import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
      maxPoolSize: 10,
    });
    console.log(`[db] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error('[db] Connection error:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  console.error('[db] Runtime connection error:', err.message);
});

const gracefulShutdown = async (signal) => {
  console.log(`[db] Received ${signal}. Closing MongoDB connection...`);
  await mongoose.connection.close();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));