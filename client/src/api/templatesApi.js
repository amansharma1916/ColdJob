import axiosInstance from './axiosInstance';

export const getTemplates = (params) => axiosInstance.get('/templates', { params });
export const getTemplate = (id) => axiosInstance.get(`/templates/${id}`);
export const createTemplate = (data) => axiosInstance.post('/templates', data);
export const updateTemplate = (id, data) => axiosInstance.put(`/templates/${id}`, data);
export const deleteTemplate = (id) => axiosInstance.delete(`/templates/${id}`);
export const duplicateTemplate = (id) => axiosInstance.post(`/templates/${id}/duplicate`);
export const setDefaultTemplate = (id) => axiosInstance.patch(`/templates/${id}/default`);