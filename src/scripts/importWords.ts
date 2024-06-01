import axios from 'axios';
import mongoose from 'mongoose';
import { envs } from '../env';
import DictionaryEntry, { IDictionaryEntry } from '../models/DictionaryEntry';

const MONGODB_URI = envs.MONGODB_URI!;
const WORDS_JSON_URL = envs.WORDS_JSON_URL;
const DICTIONARY_API_URL = envs.DICTIONARY_API_URL;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};
const fetchWordDetails = async (word: string) => {
  try {
    const response = await axios.get(`${DICTIONARY_API_URL}${word}`);
    return response.data[0];
  } catch (error) {
    console.error(`Error fetching details for word "${word}":`, error);
    return null;
  }
};

const downloadWords = async () => {
  try {
    const response = await axios.get(WORDS_JSON_URL);
    return response.data;
  } catch (error) {
    console.error('Error downloading words JSON', error);
    throw error;
  }
}

const saveWordToDatabase = async (wordDetails: any) => {
  const { word, phonetic, origin, meanings } = wordDetails;

  const newEntry: Partial<IDictionaryEntry> = {
    word,
    phonetic,
    origin,
    meanings: meanings.map((meaning: any) => ({
      partOfSpeech: meaning.partOfSpeech,
      definitions: meaning.definitions.map((def: any) => ({
        definition: def.definition,
        example: def.example,
        synonyms: def.synonyms,
        antonyms: def.antonyms,
      })),
    })),
  };

  try {
    await DictionaryEntry.create(newEntry);
    console.log(`Word "${word}" imported successfully`);
  } catch (error) {
    console.error(`Error saving word "${word}" to database`, error);
  }
};

const downloadAndImportWords = async () => {
  try {
    await connectToDatabase();
    const words = await downloadWords();

    for (const [word] of Object.entries(words)) {
      const wordDetails = await fetchWordDetails(word);
      if (wordDetails) {
        await saveWordToDatabase(wordDetails);
      }
    }
  } catch (error) {
    console.error('Error importing words', error);
  } finally {
    await mongoose.disconnect();
  }
};

downloadAndImportWords();
