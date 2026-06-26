import mongoose from 'mongoose';

const preferencesSchema = new mongoose.Schema(
  {
    defaultTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
    },
    emailsPerDay: { type: Number, default: 50 },
    timezone: { type: String, default: 'UTC' },
    signature: { type: String },
    replyTo: { type: String },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    avatar: { type: String },
    encryptedRefreshToken: { type: String },
    gmailConnected: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    preferences: { type: preferencesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

userSchema.index({ isActive: 1 });

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.encryptedRefreshToken;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;