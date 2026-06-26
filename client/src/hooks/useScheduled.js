import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getScheduledEmails, cancelScheduledEmail } from '@/api/scheduledApi';

export function useScheduled(params) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: [QUERY_KEYS.SCHEDULED, params],
    queryFn: () => getScheduledEmails(params),
  });

  const cancel = useMutation({
    mutationFn: cancelScheduledEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SCHEDULED] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Scheduled email cancelled');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to cancel scheduled email');
    },
  });

  return { list, cancel };
}