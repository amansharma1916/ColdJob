import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuEye, LuRotateCcw, LuCircleX, LuSearch } from 'react-icons/lu';
import { pageTransition } from '@/animations/variants';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { DataTable, TablePagination } from '@/components/tables/DataTable';
import { Modal } from '@/components/modals/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useHistory } from '@/hooks/useHistory';
import { formatDate, formatRelativeDate } from '@/utils/formatDate';
import { truncate } from '@/utils/truncate';
import { PAGINATION } from '@/constants/config';
import { cn } from '@/utils/classNames';

const statusBadges = {
  sent: { label: 'Sent', variant: 'success' },
  failed: { label: 'Failed', variant: 'error' },
  scheduled: { label: 'Scheduled', variant: 'info' },
  cancelled: { label: 'Cancelled', variant: 'default' },
};

export function HistoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [retryConfirm, setRetryConfirm] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);

  const { list, retry, cancel } = useHistory({ page, limit: PAGINATION.DEFAULT_PAGE_SIZE, search, status: statusFilter !== 'all' ? statusFilter : undefined });

  const emails = list.data?.data?.data?.data || [];
  const totalPages = list.data?.data?.pagination?.totalPages || 1;
  const total = list.data?.data?.pagination?.total || 0;

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'sent', label: 'Sent' },
    { key: 'failed', label: 'Failed' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const columns = [
    { key: 'recipient', label: 'Recipient', render: (row) => (
      <span className="text-gray-900">{row.to?.[0] || row.recipient || '—'}</span>
    )},
    { key: 'subject', label: 'Subject', render: (row) => truncate(row.subject, 40) },
    { key: 'template', label: 'Template', render: (row) => row.templateName || '—' },
    { key: 'status', label: 'Status', render: (row) => {
      const status = statusBadges[row.status] || statusBadges.sent;
      return <Badge variant={status.variant} size="sm">{status.label}</Badge>;
    }},
    { key: 'sentAt', label: 'Sent At', render: (row) => formatRelativeDate(row.createdAt || row.sentAt) },
    { key: 'actions', label: '', render: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => setSelectedEmail(row)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" aria-label="View"><LuEye className="h-4 w-4" /></button>
        {row.status === 'failed' && (
          <button onClick={() => setRetryConfirm(row)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100" aria-label="Retry"><LuRotateCcw className="h-4 w-4" /></button>
        )}
        {row.status === 'scheduled' && (
          <button onClick={() => setCancelConfirm(row)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100" aria-label="Cancel"><LuCircleX className="h-4 w-4" /></button>
        )}
      </div>
    )},
  ];

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible">
      <PageHeader title="Email History" />

      <div className="flex gap-3 mb-4">
        <Input placeholder="Search history..." leftIcon={LuSearch} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 mb-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setStatusFilter(tab.key); setPage(1); }}
            className={cn(
              'px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              statusFilter === tab.key
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <DataTable columns={columns} data={emails} isLoading={list.isLoading} error={list.error} />
        <TablePagination currentPage={page} totalPages={totalPages} total={total} pageSize={PAGINATION.DEFAULT_PAGE_SIZE} onPageChange={setPage} />
      </div>

      {/* View Detail Modal */}
      <Modal isOpen={!!selectedEmail} onClose={() => setSelectedEmail(null)} title="Email Details" size="lg">
        {selectedEmail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">To:</span>
                <p className="text-gray-900">{selectedEmail.recipientEmail || selectedEmail.recipient}</p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <Badge variant={(statusBadges[selectedEmail.status] || statusBadges.sent).variant} size="sm" className="ml-2">
                  {(statusBadges[selectedEmail.status] || statusBadges.sent).label}
                </Badge>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Subject:</span>
                <p className="text-gray-900 font-medium">{selectedEmail.subject}</p>
              </div>
              {selectedEmail.templateName && (
                <div>
                  <span className="text-gray-500">Template:</span>
                  <p className="text-gray-900">{selectedEmail.templateName}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Sent:</span>
                <p className="text-gray-900">{formatDate(selectedEmail.createdAt)}</p>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <span className="text-sm text-gray-500">Body:</span>
              <div
                className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: selectedEmail.body || selectedEmail.message || '' }}
              />
            </div>
            {selectedEmail.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                Error: {selectedEmail.error}
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!retryConfirm}
        onClose={() => setRetryConfirm(null)}
        onConfirm={() => { retry.mutate(retryConfirm._id || retryConfirm.id); setRetryConfirm(null); }}
        title="Retry Email"
        message="Are you sure you want to retry sending this email?"
        confirmLabel="Retry"
      />

      <ConfirmDialog
        isOpen={!!cancelConfirm}
        onClose={() => setCancelConfirm(null)}
        onConfirm={() => { cancel.mutate(cancelConfirm._id || cancelConfirm.id); setCancelConfirm(null); }}
        title="Cancel Email"
        message="Are you sure you want to cancel this scheduled email?"
        confirmLabel="Cancel"
        variant="danger"
      />
    </motion.div>
  );
}