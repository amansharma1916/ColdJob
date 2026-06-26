import mongoose from 'mongoose';
import { EMAIL_STATUS } from '../constants/emailStatus.js';

const emailHistorySchema = new mongoose.Schema(
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
    recipientEmail: { type: String, required: true, lowercase: true },
    recipientName: { type: String },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(EMAIL_STATUS),
      default: EMAIL_STATUS.PENDING,
    },
    failureReason: { type: String },
    gmailMessageId: { type: String },
    gmailThreadId: { type: String },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

emailHistorySchema.index({ userId: 1, sentAt: -1 });
emailHistorySchema.index({ userId: 1, status: 1 });
emailHistorySchema.index({ recipientEmail: 1 });
emailHistorySchema.index({ gmailMessageId: 1 });

const EmailHistory = mongoose.model('EmailHistory', emailHistorySchema);
export default EmailHistory;