import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
    iterables: {
      type: Map,
      of: [{ type: Map, of: String }],
      default: {}
    },
  },
  { timestamps: true }
);

export default mongoose.model('Page', pageSchema, 'pages');
