import axiosInstance from './axiosInstance';

export const getContacts = (params) => axiosInstance.get('/contacts', { params });
export const getContact = (id) => axiosInstance.get(`/contacts/${id}`);
export const createContact = (data) => axiosInstance.post('/contacts', data);
export const updateContact = (id, data) => axiosInstance.put(`/contacts/${id}`, data);
export const deleteContact = (id) => axiosInstance.delete(`/contacts/${id}`);
export const bulkDeleteContacts = (ids) => axiosInstance.post('/contacts/bulk-delete', { ids });
export const importContacts = (formData) =>
  axiosInstance.post('/contacts/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });