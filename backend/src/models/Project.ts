import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    summary: { type: String },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema, 'projects');
