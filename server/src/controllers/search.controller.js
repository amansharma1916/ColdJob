import {asyncHandler} from '../utils/asyncHandler.js';
import { sendSuccess } from '../helpers/response.helper.js';
import Contact from '../models/Contact.model.js';
import Template from '../models/Template.model.js';
import Resume from '../models/Resume.model.js';

export const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const userId = req.user._id;

  if (!q || q.trim().length < 2) {
    return sendSuccess(res, 200, 'Search results', { contacts: [], templates: [], resumes: [] });
  }

  const searchRegex = new RegExp(q.trim(), 'i');

  const [contacts, templates, resumes] = await Promise.all([
    Contact.find({
      userId,
      isDeleted: false,
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
        { role: searchRegex },
      ],
    })
      .select('firstName lastName email company role')
      .limit(5)
      .lean(),

    Template.find({
      userId,
      isDeleted: false,
      $or: [
        { name: searchRegex },
        { subject: searchRegex },
      ],
    })
      .select('name subject')
      .limit(5)
      .lean(),

    Resume.find({
      userId,
      isDeleted: false,
      $or: [
        { name: searchRegex },
      ],
    })
      .select('name')
      .limit(5)
      .lean(),
  ]);

  sendSuccess(res, 200, 'Search results', { contacts, templates, resumes });
});