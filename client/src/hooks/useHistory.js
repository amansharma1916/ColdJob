import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getEmailHistory, getEmailDetail, retryEmail, cancelEmail } from '@/api/historyApi';

export function useHistory(params) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: [QUERY_KEYS.EMAIL_HISTORY, params],
    queryFn: () => getEmailHistory(params),
  });

  const get = (id) =>
    useQuery({
      queryKey: [QUERY_KEYS.EMAIL_HISTORY, id],
      queryFn: () => getEmailDetail(id),
      enabled: !!id,
    });

  const retry = useMutation({
    mutationFn: retryEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMAIL_HISTORY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Email queued for retry');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to retry email');
    },
  });

  const cancel = useMutation({
    mutationFn: cancelEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMAIL_HISTORY] });
      toast.success('Email cancelled');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to cancel email');
    },
  });

  return { list, get, retry, cancel };
}