import EmailHistory from '../models/EmailHistory.model.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export const getHistory = async (userId, queryParams) => {
  const filter = { userId };
  if (queryParams.status) filter.status = queryParams.status;
  if (queryParams.startDate || queryParams.endDate) {
    filter.sentAt = {};
    if (queryParams.startDate) filter.sentAt.$gte = new Date(queryParams.startDate);
    if (queryParams.endDate) filter.sentAt.$lte = new Date(queryParams.endDate);
  }

  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit, 10) || 20));
  const sort = queryParams.sort || '-createdAt';
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    EmailHistory.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('contactId', 'firstName lastName email company')
      .populate('templateId', 'name')
      .populate('resumeId', 'name'),
    EmailHistory.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

export const getDetail = async (userId, historyId) => {
  const entry = await EmailHistory.findOne({ _id: historyId, userId })
    .populate('contactId', 'firstName lastName email company role')
    .populate('templateId', 'name subject');
  if (!entry) throw new NotFoundError('Email history entry');
  return entry;
};