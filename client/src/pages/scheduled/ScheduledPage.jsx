import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuCircleX, LuCalendarClock, LuPlus } from 'react-icons/lu';
import { pageTransition } from '@/animations/variants';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { DataTable, TablePagination } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useScheduled } from '@/hooks/useScheduled';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatRelativeDate } from '@/utils/formatDate';
import { truncate } from '@/utils/truncate';
import { PAGINATION } from '@/constants/config';

export function ScheduledPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [cancelConfirm, setCancelConfirm] = useState(null);

  const { list, cancel } = useScheduled({ page, limit: PAGINATION.DEFAULT_PAGE_SIZE });

  const emails = list.data?.data?.data || [];
  const totalPages = list.data?.data?.pagination?.totalPages || 1;
  const total = list.data?.data?.pagination?.total || 0;

  const columns = [
    { key: 'recipient', label: 'Recipient', render: (row) => (
      <span className="text-gray-900">{row.to?.[0] || row.recipient || '—'}</span>
    )},
    { key: 'subject', label: 'Subject', render: (row) => truncate(row.subject, 40) },
    { key: 'scheduledFor', label: 'Scheduled For', render: (row) => formatDate(row.scheduledAt || row.scheduledFor, 'MMM D, YYYY h:mm A') },
    { key: 'createdAt', label: 'Created', render: (row) => formatRelativeDate(row.createdAt) },
    { key: 'actions', label: '', render: (row) => (
      <button
        onClick={() => setCancelConfirm(row)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        <LuCircleX className="h-3 w-3" />
        Cancel
      </button>
    )},
  ];

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible">
      <PageHeader
        title="Scheduled Emails"
        action={
          <Button leftIcon={LuPlus} onClick={() => navigate('/compose')}>
            Compose Email
          </Button>
        }
      />

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {!list.isLoading && emails.length === 0 ? (
          <EmptyState
            icon={LuCalendarClock}
            title="No scheduled emails"
            description="Compose and schedule your first email."
            action={{ label: 'Compose Email', onClick: () => navigate('/compose') }}
          />
        ) : (
          <>
            <DataTable columns={columns} data={emails} isLoading={list.isLoading} error={list.error} />
            <TablePagination currentPage={page} totalPages={totalPages} total={total} pageSize={PAGINATION.DEFAULT_PAGE_SIZE} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!cancelConfirm}
        onClose={() => setCancelConfirm(null)}
        onConfirm={() => { cancel.mutate(cancelConfirm._id || cancelConfirm.id); setCancelConfirm(null); }}
        title="Cancel Scheduled Email"
        message="Are you sure you want to cancel this scheduled email?"
        confirmLabel="Cancel"
        variant="danger"
      />
    </motion.div>
  );
}