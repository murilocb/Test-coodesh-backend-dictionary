import User from '../models/User';
import DictionaryEntry from '../models/DictionaryEntry';

export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const getUserHistory = async (userId: string, limit: number, page: number) => {
  const query = { userId };
  const totalDocs = await DictionaryEntry.countDocuments(query);
  const results = await DictionaryEntry.find(query)
    .sort({ viewedAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .select('word viewedAt -_id')
    .exec();

  return {
    results: results.map(entry => ({ word: entry.word, added: entry.viewedAt })),
    totalDocs,
    page,
    totalPages: Math.ceil(totalDocs / limit),
    hasNext: page * limit < totalDocs,
    hasPrev: page > 1,
  };
};

export const getUserFavorites = async (userId: string, limit: number, page: number) => {
  const query = { userId, favorite: true };
  const totalDocs = await DictionaryEntry.countDocuments(query);
  const results = await DictionaryEntry.find(query)
    .sort({ viewedAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .select('word viewedAt -_id')
    .exec();

  return {
    results: results.map(entry => ({ word: entry.word, added: entry.viewedAt })),
    totalDocs,
    page,
    totalPages: Math.ceil(totalDocs / limit),
    hasNext: page * limit < totalDocs,
    hasPrev: page > 1,
  };
};
