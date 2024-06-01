import express from 'express';
import { envs } from '../src/env'
import connectDB from './config/database';
import routes from './routes';
import { connectRedis } from './config/redisClient';

const app = express();
const port = envs.PORT || 3001;

app.use(express.json());
app.use(routes);

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await connectDB();
  await connectRedis();
});

export default app;
