import axiosInstance from './axiosInstance';

export const sendEmail = (data) => axiosInstance.post('/email/send', data);
export const sendBulkEmail = (data) => axiosInstance.post('/email/bulk', data);
export const previewEmail = (data) => axiosInstance.post('/email/preview', data);