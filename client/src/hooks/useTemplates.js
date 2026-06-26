import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  setDefaultTemplate,
} from '@/api/templatesApi';

export function useTemplates(params) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: [QUERY_KEYS.TEMPLATES, params],
    queryFn: () => getTemplates(params),
  });

  const get = (id) =>
    useQuery({
      queryKey: [QUERY_KEYS.TEMPLATES, id],
      queryFn: () => getTemplate(id),
      enabled: !!id,
    });

  const create = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Template saved');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save template');
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES] });
      toast.success('Template updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update template');
    },
  });

  const remove = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Template deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete template');
    },
  });

  const duplicate = useMutation({
    mutationFn: duplicateTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES] });
      toast.success('Template duplicated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to duplicate template');
    },
  });

  const setDefault = useMutation({
    mutationFn: setDefaultTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES] });
      toast.success('Default template updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to set default template');
    },
  });

  return { list, get, create, update, remove, duplicate, setDefault };
}