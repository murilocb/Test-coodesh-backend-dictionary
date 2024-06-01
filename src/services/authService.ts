import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { envs } from '../env';

interface AuthResponse {
  id: string;
  name: string;
  token: string;
}

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ id: user._id, name: user.name }, envs.JWT_SECRET!, {
    expiresIn: '1h',
  });

  return {
    id: String(user._id),
    name: user.name,
    token: `Bearer ${token}`,
  };
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: user._id, name: user.name }, envs.JWT_SECRET!, {
    expiresIn: '1h',
  });

  return {
    id: String(user._id),
    name: user.name,
    token: `Bearer ${token}`,
  };
};
