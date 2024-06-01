import mongoose, { Document, Schema } from 'mongoose';

export interface IDictionaryEntry extends Document {
  userId: string;
  word: string;
  phonetic: string;
  origin: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
  viewedAt: Date;
  favorite: boolean;
}

const DictionaryEntrySchema: Schema = new Schema({
  userId: { type: String },
  word: { type: String, required: true },
  phonetic: String,
  origin: String,
  meanings: [
    {
      partOfSpeech: String,
      definitions: [
        {
          definition: String,
          example: String,
          synonyms: [String],
          antonyms: [String],
        },
      ],
    },
  ],
  viewedAt: { type: Date, default: Date.now },
  favorite: { type: Boolean, default: false },
});

export default mongoose.model<IDictionaryEntry>('DictionaryEntry', DictionaryEntrySchema);
