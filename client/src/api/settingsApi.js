import axiosInstance from './axiosInstance';

export const getSettings = () => axiosInstance.get('/settings');
export const updateSettings = (data) => axiosInstance.put('/settings', data);
export const updateSignature = (data) => axiosInstance.put('/settings/signature', data);
export const disconnectGmail = () => axiosInstance.post('/settings/disconnect-gmail');
export const deleteAccount = () => axiosInstance.delete('/settings/account');