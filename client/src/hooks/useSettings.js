import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getSettings, updateSettings, updateSignature, disconnectGmail, deleteAccount } from '@/api/settingsApi';

export function useSettings() {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: [QUERY_KEYS.SETTINGS],
    queryFn: getSettings,
  });

  const update = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS] });
      toast.success('Settings updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });

  const updateSig = useMutation({
    mutationFn: updateSignature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS] });
      toast.success('Signature updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update signature');
    },
  });

  const disconnect = useMutation({
    mutationFn: disconnectGmail,
    onSuccess: () => {
      localStorage.removeItem('cc_token');
      localStorage.removeItem('cc_user');
      window.location.href = '/login';
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to disconnect Gmail');
    },
  });

  const removeAccount = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      localStorage.removeItem('cc_token');
      localStorage.removeItem('cc_user');
      window.location.href = '/login';
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete account');
    },
  });

  return { list, update, updateSig, disconnect, removeAccount };
}