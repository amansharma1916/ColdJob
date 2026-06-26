import axiosInstance from './axiosInstance';

export const googleLogin = (code) => axiosInstance.get('/auth/google', { code });
export const getCurrentUser = () => axiosInstance.get('/auth/me');
export const logout = () => axiosInstance.post('/auth/logout');
export const refreshToken = () => axiosInstance.post('/auth/refresh');