import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    dailyLimit: { type: Number, default: 50 },
    defaultFromName: { type: String },
    signature: { type: String },
    trackOpens: { type: Boolean, default: false },
    trackClicks: { type: Boolean, default: false },
    replyTo: { type: String },
    unsubscribeText: { type: String },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;