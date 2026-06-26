import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  importContacts,
} from '@/api/contactsApi';

export function useContacts(params) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: [QUERY_KEYS.CONTACTS, params],
    queryFn: () => getContacts(params),
  });

  const get = (id) =>
    useQuery({
      queryKey: [QUERY_KEYS.CONTACTS, id],
      queryFn: () => getContact(id),
      enabled: !!id,
    });

  const create = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Contact added');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add contact');
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      toast.success('Contact updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update contact');
    },
  });

  const remove = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Contact deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete contact');
    },
  });

  const bulkRemove = useMutation({
    mutationFn: bulkDeleteContacts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Contacts deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete contacts');
    },
  });

  const importCsv = useMutation({
    mutationFn: importContacts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      toast.success('Contacts imported');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to import contacts');
    },
  });

  return { list, get, create, update, remove, bulkRemove, import: importCsv };
}