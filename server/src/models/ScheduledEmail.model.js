import mongoose from 'mongoose';
import { EMAIL_STATUS } from '../constants/emailStatus.js';

const scheduledEmailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'cancelled'],
      default: 'pending',
    },
    payload: { type: Object },
    attempts: { type: Number, default: 0 },
    lastAttemptAt: { type: Date },
  },
  { timestamps: true }
);

scheduledEmailSchema.index({ userId: 1, status: 1 });
scheduledEmailSchema.index({ scheduledAt: 1, status: 1 });

const ScheduledEmail = mongoose.model('ScheduledEmail', scheduledEmailSchema);
export default ScheduledEmail;