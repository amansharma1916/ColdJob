import {asyncHandler} from '../utils/asyncHandler.js';
import { sendSuccess } from '../helpers/response.helper.js';
import * as ContactService from '../services/contact.service.js';

export const createContact = asyncHandler(async (req, res) => {
  const contact = await ContactService.createContact(req.user._id, req.validated.body);
  sendSuccess(res, 201, 'Contact created', contact);
});

export const getContacts = asyncHandler(async (req, res) => {
  const result = await ContactService.getContacts(req.user._id, req.query);
  sendSuccess(res, 200, 'Contacts retrieved', result);
});

export const getContact = asyncHandler(async (req, res) => {
  const contact = await ContactService.getContact(req.user._id, req.params.id);
  sendSuccess(res, 200, 'Contact retrieved', contact);
});

export const updateContact = asyncHandler(async (req, res) => {
  const contact = await ContactService.updateContact(req.user._id, req.params.id, req.validated.body);
  sendSuccess(res, 200, 'Contact updated', contact);
});

export const deleteContact = asyncHandler(async (req, res) => {
  await ContactService.deleteContact(req.user._id, req.params.id);
  sendSuccess(res, 200, 'Contact deleted');
});

export const importContacts = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendSuccess(res, 400, 'No CSV file uploaded');
  }
  const result = await ContactService.importContacts(req.user._id, req.file.buffer);
  sendSuccess(res, 200, 'Contacts imported', result);
});

export const exportContacts = asyncHandler(async (req, res) => {
  const contacts = await ContactService.exportContacts(req.user._id);
  sendSuccess(res, 200, 'Contacts exported', contacts);
});