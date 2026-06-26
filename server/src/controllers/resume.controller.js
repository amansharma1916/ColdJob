import {asyncHandler} from '../utils/asyncHandler.js';
import { sendSuccess } from '../helpers/response.helper.js';
import * as ResumeService from '../services/resume.service.js';

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendSuccess(res, 400, 'No file uploaded');
  }
  const resume = await ResumeService.uploadResume(req.user._id, req.file, req.body);
  sendSuccess(res, 201, 'Resume uploaded', resume);
});

export const getResumes = asyncHandler(async (req, res) => {
  const result = await ResumeService.getResumes(req.user._id, req.query);
  sendSuccess(res, 200, 'Resumes retrieved', result);
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await ResumeService.getResume(req.user._id, req.params.id);
  sendSuccess(res, 200, 'Resume retrieved', resume);
});

export const updateResume = asyncHandler(async (req, res) => {
  const resume = await ResumeService.updateResume(req.user._id, req.params.id, req.validated.body);
  sendSuccess(res, 200, 'Resume updated', resume);
});

export const deleteResume = asyncHandler(async (req, res) => {
  await ResumeService.deleteResume(req.user._id, req.params.id);
  sendSuccess(res, 200, 'Resume deleted');
});

export const setDefault = asyncHandler(async (req, res) => {
  const resume = await ResumeService.setDefault(req.user._id, req.params.id);
  sendSuccess(res, 200, 'Default resume set', resume);
});