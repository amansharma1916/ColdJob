import ScheduledEmail from '../models/ScheduledEmail.model.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { buildMongooseQuery } from '../helpers/query.helper.js';

export const getScheduledEmails = async (userId, queryParams) => {
  const filter = { userId, status: 'pending' };
  return buildMongooseQuery(ScheduledEmail, filter, queryParams);
};

export const getScheduledEmail = async (userId, scheduledId) => {
  const email = await ScheduledEmail.findOne({ _id: scheduledId, userId });
  if (!email) throw new NotFoundError('Scheduled email');
  return email;
};

export const cancelScheduledEmail = async (userId, scheduledId) => {
  const email = await ScheduledEmail.findOneAndUpdate(
    { _id: scheduledId, userId, status: 'pending' },
    { status: 'cancelled' },
    { new: true }
  );
  if (!email) throw new NotFoundError('Scheduled email');
  return email;
};

export const createScheduledEmail = async (userId, data) => {
  const scheduledEmail = await ScheduledEmail.create({
    userId,
    ...data,
    status: 'pending',
  });
  return scheduledEmail;
};