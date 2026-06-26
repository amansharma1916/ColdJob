import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuPlus, LuFileText, LuEye, LuCopy, LuPencil, LuStar, LuTrash2 } from 'react-icons/lu';
import { pageTransition } from '@/animations/variants';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { DataTable, TablePagination } from '@/components/tables/DataTable';
import { Modal } from '@/components/modals/Modal';
import { Textarea } from '@/components/common/Textarea';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useTemplates } from '@/hooks/useTemplates';
import { formatRelativeDate } from '@/utils/formatDate';
import { truncate } from '@/utils/truncate';
import { PAGINATION } from '@/constants/config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().optional(),
  body: z.string().min(1, 'Body is required'),
});

export function TemplatesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { list, create, update, remove, duplicate, setDefault } = useTemplates({ page, limit: PAGINATION.DEFAULT_PAGE_SIZE, search, sort });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(templateSchema),
  });

  const templates = list.data?.data?.data?.data || [];
  const totalPages = list.data?.data?.data?.pagination?.totalPages || 1;
  const total = list.data?.data?.data?.pagination?.total || 0;

  const openCreate = () => {
    setEditingTemplate(null);
    reset({ name: '', subject: '', body: '' });
    setShowCreateModal(true);
  };

  const openEdit = (template) => {
    setEditingTemplate(template);
    reset({
      name: template.name || '',
      subject: template.subject || '',
      body: template.body || '',
    });
    setShowCreateModal(true);
  };

  const onSubmit = (data) => {
    if (editingTemplate) {
      update.mutate({ id: editingTemplate._id || editingTemplate.id, data });
    } else {
      create.mutate(data);
    }
    setShowCreateModal(false);
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (row) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900">{row.name}</span>
        {row.isDefault && <Badge variant="info" size="sm">Default</Badge>}
      </div>
    ) },
    { key: 'subject', label: 'Subject', render: (row) => truncate(row.subject, 60) },
    { key: 'variables', label: 'Variables', render: (row) => {
      const vars = row.body ? (row.body.match(/\{\{(\w+)\}\}/g) || []).length : 0;
      return <span className="text-gray-500">{vars}</span>;
    }},
    { key: 'createdAt', label: 'Created', sortable: true, render: (row) => formatRelativeDate(row.createdAt) },
    { key: 'actions', label: '', render: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => setPreviewTemplate(row)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" aria-label="Preview"><LuEye className="h-4 w-4" /></button>
        <button onClick={() => duplicate.mutate(row._id || row.id)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" aria-label="Duplicate"><LuCopy className="h-4 w-4" /></button>
        <button onClick={() => openEdit(row)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" aria-label="Edit"><LuPencil className="h-4 w-4" /></button>
        <button onClick={() => setDefault.mutate(row._id || row.id)} className={`p-1.5 rounded-md hover:bg-gray-100 ${row.isDefault ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`} aria-label="Set default"><LuStar className="h-4 w-4" /></button>
        <button onClick={() => setDeleteConfirm(row)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100" aria-label="Delete"><LuTrash2 className="h-4 w-4" /></button>
      </div>
    )},
  ];

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible">
      <PageHeader
        title="Templates"
        action={<Button leftIcon={LuPlus} onClick={openCreate}>New Template</Button>}
      />

      <div className="flex gap-3 mb-4">
        <Input
          placeholder="Search templates..."
          leftIcon={LuFileText}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <DataTable columns={columns} data={templates} isLoading={list.isLoading} error={list.error} />
        <TablePagination currentPage={page} totalPages={totalPages} total={total} pageSize={PAGINATION.DEFAULT_PAGE_SIZE} onPageChange={setPage} />
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title={editingTemplate ? 'Edit Template' : 'Create Template'} size="xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Template Name" error={errors.name?.message} {...register('name')} />
          <Input label="Default Subject" {...register('subject')} />
          <Textarea label="Body" className="min-h-[300px] font-mono" error={errors.body?.message} {...register('body')} />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={create.isPending || update.isPending}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!previewTemplate} onClose={() => setPreviewTemplate(null)} title={previewTemplate?.name || 'Preview Template'} size="xl">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Subject</label>
            <p className="text-sm text-gray-900 bg-gray-50 rounded-md p-3">{previewTemplate?.subject || '(No subject)'}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Body</label>
            <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-md p-3 min-h-[200px] font-mono">
              {previewTemplate?.body || '(No body)'}
            </div>
          </div>
          {previewTemplate?.placeholders && previewTemplate.placeholders.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Placeholders</label>
              <div className="flex flex-wrap gap-1.5">
                {previewTemplate.placeholders.map((p) => (
                  <span key={p} className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md">{'{{'}{p}{'}}'}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="ghost" type="button" onClick={() => setPreviewTemplate(null)}>Close</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { remove.mutate(deleteConfirm._id || deleteConfirm.id); setDeleteConfirm(null); }}
        title="Delete Template"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"?`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  );
}