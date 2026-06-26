import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuPlus, LuDownload, LuUsers, LuMail, LuPencil, LuTrash2, LuCheck } from 'react-icons/lu';
import { pageTransition } from '@/animations/variants';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { DataTable, TablePagination } from '@/components/tables/DataTable';
import { Modal } from '@/components/modals/Modal';
import { Textarea } from '@/components/common/Textarea';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Badge } from '@/components/common/Badge';
import { useContacts } from '@/hooks/useContacts';
import { formatRelativeDate } from '@/utils/formatDate';
import { PAGINATION } from '@/constants/config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
  role: z.string().optional(),
  notes: z.string().optional(),
});

export function ContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const { list, create, update, remove, bulkRemove } = useContacts({ page, limit: PAGINATION.DEFAULT_PAGE_SIZE, search });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const contacts = list.data?.data?.data?.data || [];
  const totalPages = list.data?.data?.pagination?.totalPages || 1;
  const total = list.data?.data?.pagination?.total || 0;

  const openCreate = () => {
    setEditingContact(null);
    reset({ firstName: '', lastName: '', email: '', company: '', role: '', notes: '' });
    setShowModal(true);
  };

  const openEdit = (contact) => {
    setEditingContact(contact);
    reset({
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      company: contact.company || '',
      role: contact.role || '',
      notes: contact.notes || '',
    });
    setShowModal(true);
  };

  const onSubmit = (data) => {
    if (editingContact) {
      update.mutate({ id: editingContact._id || editingContact.id, data });
    } else {
      create.mutate(data);
    }
    setShowModal(false);
  };

  const columns = [
    { key: 'checkbox', label: '', render: (row) => (
      <input
        type="checkbox"
        checked={selectedIds.includes(row._id || row.id)}
        onChange={() => {
          const id = row._id || row.id;
          setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
          );
        }}
        className="text-blue-600 rounded focus:ring-blue-500"
      />
    )},
    { key: 'name', label: 'Name', sortable: true, render: (row) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
          {(row.firstName?.[0] || '') + (row.lastName?.[0] || '') || '?'}
        </div>
        <span className="font-medium text-gray-900">{row.firstName} {row.lastName}</span>
      </div>
    )},
    { key: 'email', label: 'Email', render: (row) => (
      <a href={`mailto:${row.email}`} className="text-blue-600 hover:text-blue-700 text-sm">
        {row.email}
      </a>
    )},
    { key: 'company', label: 'Company', render: (row) => row.company || '—' },
    { key: 'role', label: 'Role', render: (row) => row.role || '—' },
    { key: 'createdAt', label: 'Added', render: (row) => formatRelativeDate(row.createdAt) },
    { key: 'actions', label: '', render: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(row)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" aria-label="Edit"><LuPencil className="h-4 w-4" /></button>
        <button onClick={() => setDeleteConfirm(row)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100" aria-label="Delete"><LuTrash2 className="h-4 w-4" /></button>
      </div>
    )},
  ];

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible">
      <PageHeader
        title="Contacts"
        action={
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={LuDownload}>Import CSV</Button>
            <Button leftIcon={LuPlus} onClick={openCreate}>Add Contact</Button>
          </div>
        }
      />

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <span className="text-sm text-blue-700 font-medium">{selectedIds.length} selected</span>
          <Button size="sm" variant="danger" onClick={() => { bulkRemove.mutate(selectedIds); setSelectedIds([]); }}>
            Delete selected
          </Button>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <Input placeholder="Search contacts..." leftIcon={LuUsers} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <DataTable columns={columns} data={contacts} isLoading={list.isLoading} error={list.error} />
        <TablePagination currentPage={page} totalPages={totalPages} total={total} pageSize={PAGINATION.DEFAULT_PAGE_SIZE} onPageChange={setPage} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingContact ? 'Edit Contact' : 'Add Contact'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last Name" {...register('lastName')} />
          </div>
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company" {...register('company')} />
            <Input label="Role" {...register('role')} />
          </div>
          <Textarea label="Notes" {...register('notes')} />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={create.isPending || update.isPending}>Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { remove.mutate(deleteConfirm._id || deleteConfirm.id); setDeleteConfirm(null); }}
        title="Delete Contact"
        message={`Are you sure you want to delete ${deleteConfirm?.firstName} ${deleteConfirm?.lastName}?`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  );
}