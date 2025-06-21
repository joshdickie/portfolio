import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    path: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Resource', resourceSchema, 'resources');
