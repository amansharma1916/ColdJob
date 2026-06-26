import mongoose from 'mongoose';
import EmailHistory from '../models/EmailHistory.model.js';
import Template from '../models/Template.model.js';
import Resume from '../models/Resume.model.js';
import Contact from '../models/Contact.model.js';
import ScheduledEmail from '../models/ScheduledEmail.model.js';

export const getStats = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [aggregation, templateCount, resumeCount, contactCount, scheduledCount] = await Promise.all([
    EmailHistory.aggregate([
      { $match: { userId: userObjectId } },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalSent: { $sum: 1 },
                successCount: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
                failureCount: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
              },
            },
          ],
          today: [
            { $match: { sentAt: { $gte: today } } },
            {
              $group: {
                _id: null,
                todaySent: { $sum: 1 },
                todaySuccess: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
                todayFailed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
              },
            },
          ],
          last7Days: [
            { $match: { sentAt: { $gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) } } },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$sentAt' } },
                sent: { $sum: 1 },
                success: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
                failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: {
                _id: 0,
                date: '$_id',
                sent: 1,
                success: 1,
                failed: 1,
              },
            },
          ],
          recentActivity: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'contacts',
                localField: 'contactId',
                foreignField: '_id',
                as: 'contact',
              },
            },
            { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'templates',
                localField: 'templateId',
                foreignField: '_id',
                as: 'template',
              },
            },
            { $unwind: { path: '$template', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                recipientEmail: 1,
                recipientName: 1,
                subject: 1,
                status: 1,
                sentAt: 1,
                createdAt: 1,
                'contact.firstName': 1,
                'contact.lastName': 1,
                'template.name': 1,
              },
            },
          ],
        },
      },
    ]),
    Template.countDocuments({ userId, isDeleted: false }),
    Resume.countDocuments({ userId, isDeleted: false }),
    Contact.countDocuments({ userId, isDeleted: false }),
    ScheduledEmail.countDocuments({ userId, status: 'pending' }),
  ]);

  const summary = aggregation[0]?.summary[0] || { totalSent: 0, successCount: 0, failureCount: 0 };
  const todayStats = aggregation[0]?.today[0] || { todaySent: 0, todaySuccess: 0, todayFailed: 0 };
  const recentActivity = aggregation[0]?.recentActivity || [];
  const chartData = aggregation[0]?.last7Days || [];

  return {
    summary: {
      totalSent: summary.totalSent,
      successCount: summary.successCount,
      failureCount: summary.failureCount,
      ...todayStats,
    },
    counts: {
      templates: templateCount,
      resumes: resumeCount,
      contacts: contactCount,
      scheduled: scheduledCount,
    },
    recentActivity,
    chartData,
  };
};