import {asyncHandler} from '../utils/asyncHandler.js';
import { sendSuccess } from '../helpers/response.helper.js';
import * as TemplateService from '../services/template.service.js';

export const createTemplate = asyncHandler(async (req, res) => {
  const template = await TemplateService.createTemplate(req.user._id, req.validated.body);
  sendSuccess(res, 201, 'Template created', template);
});

export const getTemplates = asyncHandler(async (req, res) => {
  const result = await TemplateService.getTemplates(req.user._id, req.query);
  sendSuccess(res, 200, 'Templates retrieved', result);
});

export const getTemplate = asyncHandler(async (req, res) => {
  const template = await TemplateService.getTemplate(req.user._id, req.params.id);
  sendSuccess(res, 200, 'Template retrieved', template);
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const template = await TemplateService.updateTemplate(req.user._id, req.params.id, req.validated.body);
  sendSuccess(res, 200, 'Template updated', template);
});

export const deleteTemplate = asyncHandler(async (req, res) => {
  await TemplateService.deleteTemplate(req.user._id, req.params.id);
  sendSuccess(res, 200, 'Template deleted');
});

export const setDefault = asyncHandler(async (req, res) => {
  const template = await TemplateService.setDefault(req.user._id, req.params.id);
  sendSuccess(res, 200, 'Default template set', template);
});

export const previewTemplate = asyncHandler(async (req, res) => {
  const { templateId, placeholders } = req.validated.body;
  const preview = await TemplateService.previewTemplate(req.user._id, templateId, placeholders);
  sendSuccess(res, 200, 'Template preview generated', preview);
});

export const duplicateTemplate = asyncHandler(async (req, res) => {
  const template = await TemplateService.duplicateTemplate(req.user._id, req.params.id);
  sendSuccess(res, 201, 'Template duplicated', template);
});
