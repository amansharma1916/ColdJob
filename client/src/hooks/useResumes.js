import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getResumes, uploadResume, deleteResume, renameResume, setDefaultResume } from '@/api/resumesApi';

export function useResumes() {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: [QUERY_KEYS.RESUMES],
    queryFn: getResumes,
  });

  const upload = useMutation({
    mutationFn: ({ formData, onUploadProgress }) => uploadResume(formData, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESUMES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Resume uploaded');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload resume');
    },
  });

  const remove = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESUMES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Resume deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete resume');
    },
  });

  const rename = useMutation({
    mutationFn: ({ id, name }) => renameResume(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESUMES] });
      toast.success('Resume renamed');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to rename resume');
    },
  });

  const setDefault = useMutation({
    mutationFn: setDefaultResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESUMES] });
      toast.success('Default resume updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to set default resume');
    },
  });

  return { list, upload, remove, rename, setDefault };
}