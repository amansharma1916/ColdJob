import User from '../models/User.model.js';
import Settings from '../models/Settings.model.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('User');
  return user.toSafeObject();
};

export const updateProfile = async (userId, data) => {
  const allowedFields = ['name', 'avatar', 'preferences'];
  const updateData = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) throw new NotFoundError('User');
  return user.toSafeObject();
};

export const deleteAccount = async (userId) => {
  await User.findByIdAndUpdate(userId, { isActive: false });
  await Settings.deleteOne({ userId });
};