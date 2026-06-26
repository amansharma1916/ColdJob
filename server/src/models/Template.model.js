import mongoose from 'mongoose';
import { PLACEHOLDER_REGEX } from '../constants/placeholders.js';

const templateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    subject: { type: String, required: true, trim: true, maxlength: 500 },
    body: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    tags: [{ type: String }],
    placeholders: [{ type: String }],
    usageCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

templateSchema.index({ userId: 1, isDeleted: 1 });
templateSchema.index({ userId: 1, isDefault: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ name: 'text', subject: 'text', body: 'text' });

templateSchema.pre('save', function (next) {
  const combined = `${this.subject} ${this.body}`;
  const matches = combined.match(PLACEHOLDER_REGEX);
  if (matches) {
    const keys = matches.map((m) => m.replace(/[{}]/g, ''));
    this.placeholders = [...new Set(keys)];
  } else {
    this.placeholders = [];
  }
  // next();
});

const Template = mongoose.model('Template', templateSchema);
export default Template;