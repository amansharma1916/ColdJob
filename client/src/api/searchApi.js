import axiosInstance from './axiosInstance';

export const globalSearch = (q) => axiosInstance.get('/search', { params: { q } });