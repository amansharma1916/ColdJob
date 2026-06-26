import Template from '../models/Template.model.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { buildMongooseQuery } from '../helpers/query.helper.js';
import { replace } from './placeholder.service.js';

export const createTemplate = async (userId, data) => {
  const template = await Template.create({ userId, ...data });
  return template;
};

export const getTemplates = async (userId, queryParams) => {
  const filter = { userId, isDeleted: false };
  if (queryParams.tag) filter.tags = queryParams.tag;
  return buildMongooseQuery(Template, filter, queryParams);
};

export const getTemplate = async (userId, templateId) => {
  const template = await Template.findOne({ _id: templateId, userId, isDeleted: false });
  if (!template) throw new NotFoundError('Template');
  return template;
};

export const updateTemplate = async (userId, templateId, data) => {
  const template = await Template.findOneAndUpdate(
    { _id: templateId, userId, isDeleted: false },
    data,
    { new: true, runValidators: true }
  );
  if (!template) throw new NotFoundError('Template');
  return template;
};

export const deleteTemplate = async (userId, templateId) => {
  const template = await Template.findOneAndUpdate(
    { _id: templateId, userId },
    { isDeleted: true },
    { new: true }
  );
  if (!template) throw new NotFoundError('Template');
};

export const setDefault = async (userId, templateId) => {
  const template = await Template.findOne({ _id: templateId, userId, isDeleted: false });
  if (!template) throw new NotFoundError('Template');
  await Template.updateMany({ userId, isDeleted: false }, { isDefault: false });
  template.isDefault = true;
  await template.save();
  return template;
};

export const previewTemplate = async (userId, templateId, placeholders = {}) => {
  const template = await getTemplate(userId, templateId);
  return {
    subject: replace(template.subject, placeholders),
    body: replace(template.body, placeholders),
  };
};

export const duplicateTemplate = async (userId, templateId) => {
  const template = await getTemplate(userId, templateId);
  const duplicate = await Template.create({
    userId,
    name: `${template.name} (Copy)`,
    subject: template.subject,
    body: template.body,
    tags: template.tags,
  });
  return duplicate;
};
