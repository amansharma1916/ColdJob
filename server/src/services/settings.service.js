import Settings from '../models/Settings.model.js';

export const getSettings = async (userId) => {
  const settings = await Settings.findOne({ userId });
  if (!settings) {
    return await Settings.create({ userId });
  }
  return settings;
};

export const updateSettings = async (userId, data) => {
  const settings = await Settings.findOneAndUpdate({ userId }, data, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  return settings;
};

export const updateSignature = async (userId, signature) => {
  const settings = await Settings.findOneAndUpdate(
    { userId },
    { $set: { signature } },
    { new: true, upsert: true }
  );
  return settings;
};
