import mongoose from 'mongoose';
import { envs } from '../env';

const connectDB = async () => {
  try {
    await mongoose.connect(envs.MONGODB_URI!);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
