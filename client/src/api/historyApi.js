import axiosInstance from './axiosInstance';

export const getEmailHistory = (params) => axiosInstance.get('/history', { params });
export const getEmailDetail = (id) => axiosInstance.get(`/history/${id}`);
export const retryEmail = (id) => axiosInstance.post(`/history/${id}/retry`);
export const cancelEmail = (id) => axiosInstance.post(`/history/${id}/cancel`);
