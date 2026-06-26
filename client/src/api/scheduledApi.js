import axiosInstance from './axiosInstance';

export const getScheduledEmails = (params) => axiosInstance.get('/scheduled', { params });
export const cancelScheduledEmail = (id) => axiosInstance.delete(`/scheduled/${id}`);
