import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true },
    role: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    website: { type: String, trim: true },
    notes: { type: String },
    tags: [{ type: String }],
    emailsSent: { type: Number, default: 0 },
    lastEmailedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

contactSchema.index({ userId: 1, isDeleted: 1 });
contactSchema.index({ userId: 1, email: 1 }, { unique: true });
contactSchema.index({ tags: 1 });
contactSchema.index({ firstName: 'text', lastName: 'text', email: 'text', company: 'text', role: 'text' });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;