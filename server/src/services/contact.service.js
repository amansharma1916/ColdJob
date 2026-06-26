import Contact from '../models/Contact.model.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { buildMongooseQuery } from '../helpers/query.helper.js';

export const createContact = async (userId, data) => {
  const existing = await Contact.findOne({ userId, email: data.email, isDeleted: false });
  if (existing) throw new ConflictError('A contact with this email already exists.');

  const contact = await Contact.create({ userId, ...data });
  return contact;
};

export const getContacts = async (userId, queryParams) => {
  const filter = { userId, isDeleted: false };
  return buildMongooseQuery(Contact, filter, queryParams);
};

export const getContact = async (userId, contactId) => {
  const contact = await Contact.findOne({ _id: contactId, userId, isDeleted: false });
  if (!contact) throw new NotFoundError('Contact');
  return contact;
};

export const updateContact = async (userId, contactId, data) => {
  if (data.email) {
    const existing = await Contact.findOne({
      userId,
      email: data.email,
      _id: { $ne: contactId },
      isDeleted: false,
    });
    if (existing) throw new ConflictError('A contact with this email already exists.');
  }

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId, isDeleted: false },
    data,
    { new: true, runValidators: true }
  );
  if (!contact) throw new NotFoundError('Contact');
  return contact;
};

export const deleteContact = async (userId, contactId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    { isDeleted: true },
    { new: true }
  );
  if (!contact) throw new NotFoundError('Contact');
};

export const importContacts = async (userId, csvBuffer) => {
  const csvString = csvBuffer.toString('utf-8');
  const lines = csvString.split('\n').filter((l) => l.trim());
  if (lines.length < 2) {
    return { inserted: 0, skipped: 0, errors: [{ line: 0, message: 'CSV must have header + data rows' }] };
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const results = { inserted: 0, skipped: 0, errors: [] };

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',').map((v) => v.trim());
      const row = {};
      headers.forEach((h, idx) => {
        if (idx < values.length) row[h] = values[idx];
      });

      if (!row.email) {
        results.errors.push({ line: i + 1, message: 'Missing email' });
        continue;
      }

      const existing = await Contact.findOne({ userId, email: row.email });
      if (existing) {
        results.skipped++;
        continue;
      }

      await Contact.create({
        userId,
        firstName: row.first_name || row.firstname || row.name || 'Unknown',
        lastName: row.last_name || row.lastname || '',
        email: row.email,
        company: row.company || '',
        role: row.role || row.title || '',
        linkedinUrl: row.linkedin || '',
        website: row.website || '',
        notes: row.notes || '',
        tags: row.tags ? row.tags.split(';').map((t) => t.trim()).filter(Boolean) : [],
      });

      results.inserted++;
    } catch (err) {
      results.errors.push({ line: i + 1, message: err.message });
    }
  }

  return results;
};

export const exportContacts = async (userId) => {
  const contacts = await Contact.find({ userId, isDeleted: false }).lean();
  return contacts;
};