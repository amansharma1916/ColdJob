import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['resume', 'cover_letter', 'certificate', 'portfolio'],
      default: 'resume',
    },
    cloudinaryId: { type: String, required: true },
    secureUrl: { type: String, required: true },
    fileSize: { type: Number },
    format: { type: String },
    isDefault: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1, isDeleted: 1 });
resumeSchema.index({ userId: 1, type: 1 });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;