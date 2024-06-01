import express, { Router } from 'express';

const router: Router = express.Router();

export default router.get('/', async (req, res) => {
  try {
    return res.status(200).json({ message: "Fullstack Challenge 🏅 - Dictionary" })
  } catch (error: any) {
    return res.status(500).send({ error: "Fullstack Challenge 🏅 - Dictionary" });
  }
});