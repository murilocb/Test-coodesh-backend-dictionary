import dotenv from 'dotenv';

dotenv.config();

export const envs = {
  PORT: process.env.PORT as string,
  MONGODB_URI: process.env.MONGODB_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  WORDS_JSON_URL: process.env.WORDS_JSON_URL as string,
  REDIS_URL: process.env.REDIS_URL as string,
  DICTIONARY_API_URL: process.env.DICTIONARY_API_URL as string,
}