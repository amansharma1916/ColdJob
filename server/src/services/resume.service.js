import Resume from '../models/Resume.model.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { buildMongooseQuery } from '../helpers/query.helper.js';
import { uploadFile, deleteFile } from './cloudinary.service.js';

export const uploadResume = async (userId, file, metadata) => {
  const result = await uploadFile(file.buffer, {
    filename: file.originalname,
    folder: `cold-email-platform/${userId}/resumes`,
  });

  const resume = await Resume.create({
    userId,
    name: metadata.name || file.originalname,
    type: metadata.type || 'resume',
    cloudinaryId: result.public_id,
    secureUrl: result.secure_url,
    fileSize: result.bytes,
    format: result.format,
  });

  return resume;
};

export const getResumes = async (userId, queryParams) => {
  const filter = { userId, isDeleted: false };
  if (queryParams.type) filter.type = queryParams.type;
  return buildMongooseQuery(Resume, filter, queryParams);
};

export const getResume = async (userId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, userId, isDeleted: false });
  if (!resume) throw new NotFoundError('Resume');
  return resume;
};

export const updateResume = async (userId, resumeId, data) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId, isDeleted: false },
    data,
    { new: true }
  );
  if (!resume) throw new NotFoundError('Resume');
  return resume;
};

export const deleteResume = async (userId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, userId, isDeleted: false });
  if (!resume) throw new NotFoundError('Resume');

  await deleteFile(resume.cloudinaryId);

  resume.isDeleted = true;
  await resume.save();
};

export const setDefault = async (userId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, userId, isDeleted: false });
  if (!resume) throw new NotFoundError('Resume');

  await Resume.updateMany({ userId, type: resume.type, isDeleted: false }, { isDefault: false });
  resume.isDefault = true;
  await resume.save();
  return resume;
};