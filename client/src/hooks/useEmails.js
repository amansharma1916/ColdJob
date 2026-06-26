import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { sendEmail, sendBulkEmail, previewEmail } from '@/api/emailsApi';

export function useEmails() {
  const queryClient = useQueryClient();

  const send = useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMAIL_HISTORY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Email sent successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send email');
    },
  });

  const sendBulk = useMutation({
    mutationFn: sendBulkEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMAIL_HISTORY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Emails sent successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send emails');
    },
  });

  const preview = useMutation({
    mutationFn: previewEmail,
  });

  return { send, sendBulk, preview };
}