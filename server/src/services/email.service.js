import Template from '../models/Template.model.js';
import Contact from '../models/Contact.model.js';
import Resume from '../models/Resume.model.js';
import EmailHistory from '../models/EmailHistory.model.js';
import Settings from '../models/Settings.model.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { replace } from './placeholder.service.js';
import { sendEmail as sendViaGmail } from './gmail.service.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendSingleEmail = async (userId, payload) => {
  const { recipientEmail, contactId, subject, body, templateId, resumeId, extraPlaceholders } = payload;

  // Fetch template if provided (for usage tracking and placeholder resolution)
  let template = null;
  if (templateId) {
    template = await Template.findOne({ _id: templateId, userId, isDeleted: false });
    if (!template) throw new NotFoundError('Template');
  }

  // Resolve recipient info
  let to = recipientEmail;
  let name = recipientEmail;

  if (contactId) {
    const contact = await Contact.findOne({ _id: contactId, userId, isDeleted: false });
    if (!contact) throw new NotFoundError('Contact');
    to = contact.email;
    name = contact.firstName || contact.email;
  }

  if (!to) throw new NotFoundError('Recipient email');

  // Use provided subject/body, or fall back to template
  const emailSubject = subject || template?.subject || '';
  const emailBody = body || template?.body || '';

  if (!emailSubject || !emailBody) {
    throw new ValidationError('Email subject and body are required');
  }

  // Build placeholder map
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const placeholderMap = {
    recipient_name: name,
    first_name: name.split(' ')[0] || name,
    date: now.toLocaleDateString(),
    day: days[now.getDay()],
    month: months[now.getMonth()],
    year: String(now.getFullYear()),
    ...extraPlaceholders,
  };

  const resolvedSubject = replace(emailSubject, placeholderMap);
  let resolvedBody = replace(emailBody, placeholderMap).replace(/\n/g, '<br>');

  // Append user signature if exists
  const settings = await Settings.findOne({ userId });
  if (settings?.signature) {
    resolvedBody = `${resolvedBody}<br><br>${settings.signature.replace(/\n/g, '<br>')}`;
  }

  // Check daily limit
  const dailyLimit = settings?.dailyLimit || 50;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = await EmailHistory.countDocuments({
    userId,
    sentAt: { $gte: today },
    status: 'sent',
  });

  if (todayCount >= dailyLimit) {
    throw new ForbiddenError(`Daily send limit of ${dailyLimit} reached.`);
  }

  // Resolve resume URL if provided
  let resumeUrl = null;
  if (resumeId) {
    const resume = await Resume.findOne({ _id: resumeId, userId, isDeleted: false });
    if (resume) {
      resumeUrl = resume.secureUrl;
    }
  }

  console.log("resume url " + resumeUrl);

  // Send via Gmail
  let gmailResult;
  try {
    gmailResult = await sendViaGmail(userId, {
      to,
      subject: resolvedSubject,
      htmlBody: resolvedBody,
      resumeUrl,
    });
  } catch (err) {
    // Create failed history entry
    const historyEntry = await EmailHistory.create({
      userId,
      contactId,
      templateId,
      resumeId,
      recipientEmail: to,
      recipientName: name,
      subject: resolvedSubject,
      body: resolvedBody,
      status: 'failed',
      failureReason: err.message,
    });
    throw err;
  }

  // Create success history entry
  const historyEntry = await EmailHistory.create({
    userId,
    contactId,
    templateId,
    resumeId,
    recipientEmail: to,
    recipientName: name,
    subject: resolvedSubject,
    body: resolvedBody,
    status: 'sent',
    gmailMessageId: gmailResult.gmailMessageId,
    gmailThreadId: gmailResult.gmailThreadId,
    sentAt: new Date(),
  });

  // Update contact stats
  if (contactId) {
    await Contact.findByIdAndUpdate(contactId, {
      $inc: { emailsSent: 1 },
      lastEmailedAt: new Date(),
    });
  }

  // Update template usage
  if (templateId) {
    await Template.findByIdAndUpdate(templateId, { $inc: { usageCount: 1 } });
  }

  return historyEntry;
};

export const sendBulkEmail = async (userId, payload) => {
  const { contactIds, manualEmails, subject, body, templateId, resumeId, extraPlaceholders, delayMs = 1000 } = payload;

  const results = { success: [], failed: [] };

  // Process contacts (saved contacts)
  if (contactIds && contactIds.length > 0) {
    const contacts = await Contact.find({
      _id: { $in: contactIds },
      userId,
      isDeleted: false,
    });

    for (const contact of contacts) {
      try {
        const entry = await sendSingleEmail(userId, {
          contactId: contact._id,
          subject,
          body,
          templateId,
          resumeId,
          extraPlaceholders,
        });
        results.success.push({ contactId: contact._id, email: contact.email, historyId: entry._id });
      } catch (err) {
        results.failed.push({ contactId: contact._id, email: contact.email, error: err.message });
      }
      await delay(delayMs);
    }
  }

  // Process manual emails (direct email addresses)
  if (manualEmails && manualEmails.length > 0) {
    for (const email of manualEmails) {
      try {
        const entry = await sendSingleEmail(userId, {
          recipientEmail: email,
          subject,
          body,
          templateId,
          resumeId,
          extraPlaceholders,
        });
        results.success.push({ email, historyId: entry._id });
      } catch (err) {
        results.failed.push({ email, error: err.message });
      }
      await delay(delayMs);
    }
  }

  return results;
};

export const previewEmail = async (userId, payload) => {
  const { templateId, contactId, recipientEmail, extraPlaceholders } = payload;

  let template = null;
  if (templateId) {
    template = await Template.findOne({ _id: templateId, userId, isDeleted: false });
    if (!template) throw new NotFoundError('Template');
  }

  let name = recipientEmail;
  if (contactId) {
    const contact = await Contact.findOne({ _id: contactId, userId, isDeleted: false });
    if (contact) name = contact.firstName || contact.email;
  }

  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const placeholderMap = {
    recipient_name: name,
    first_name: name.split(' ')[0] || name,
    date: now.toLocaleDateString(),
    day: days[now.getDay()],
    month: months[now.getMonth()],
    year: String(now.getFullYear()),
    ...extraPlaceholders,
  };

  const subject = template ? replace(template.subject, placeholderMap) : '';
  const body = template ? replace(template.body, placeholderMap) : '';

  return {
    subject,
    body,
    placeholders: template?.placeholders || [],
  };
};