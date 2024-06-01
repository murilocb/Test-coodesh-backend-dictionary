import axios from 'axios';
import DictionaryEntry, { IDictionaryEntry } from '../models/DictionaryEntry';
import { envs } from '../env';


const API_URL = envs.DICTIONARY_API_URL;

export const getWords = async (search: string, limit: number, page: number) => {
  const query = search ? { word: { $regex: search, $options: 'i' } } : {};
  const totalDocs = await DictionaryEntry.countDocuments(query);
  const results = await DictionaryEntry.find(query)
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();

  return {
    results,
    totalDocs,
    page,
    totalPages: Math.ceil(totalDocs / limit),
    hasNext: page * limit < totalDocs,
    hasPrev: page > 1,
  };
};

export const getWordDetails = async (userId: string, word: string): Promise<IDictionaryEntry> => {
  const response = await axios.get(`${API_URL}/${word}`);

  await DictionaryEntry.findOneAndUpdate(
    { userId, word },
    { $set: { viewedAt: new Date() }, $setOnInsert: { favorite: false } },
    { upsert: true, new: true }
  );

  return response.data[0];
};

export const addFavorite = async (userId: string, word: string) => {
  await DictionaryEntry.findOneAndUpdate(
    { userId, word },
    { $set: { favorite: true } },
    { upsert: true }
  );
};

export const removeFavorite = async (userId: string, word: string) => {
  await DictionaryEntry.findOneAndUpdate(
    { userId, word },
    { $set: { favorite: false } }
  );
};
