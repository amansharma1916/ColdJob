import axiosInstance from './axiosInstance';

export const getResumes = () => axiosInstance.get('/resumes');
export const uploadResume = (formData, onUploadProgress) =>
  axiosInstance.post('/resumes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
export const deleteResume = (id) => axiosInstance.delete(`/resumes/${id}`);
export const renameResume = (id, name) => axiosInstance.patch(`/resumes/${id}`, { name });
export const setDefaultResume = (id) => axiosInstance.patch(`/resumes/${id}/default`);