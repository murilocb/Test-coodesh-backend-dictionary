import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userData = await registerUser(name, email, password);
    return res.status(201).json(userData);
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userData = await loginUser(email, password);
    return res.status(200).json(userData);
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
};
