import { motion } from 'framer-motion';
import { LuChevronUp, LuChevronDown } from 'react-icons/lu';
import { cn } from '@/utils/classNames';
import { SkeletonTableRow } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { staggerContainer, slideUp } from '@/animations/variants';

export function DataTable({
  columns,
  data,
  isLoading,
  error,
  emptyState,
  onSort,
  sortConfig,
  onRowClick,
  className,
}) {
  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full border-collapse min-w-[600px] md:min-w-0">
        <thead>
          <tr className="border-b border-gray-200 bg-white">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap',
                  column.sortable && 'cursor-pointer select-none hover:text-gray-700'
                )}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center gap-1">
                  {column.label}
                  {column.sortable && sortConfig?.key === column.key && (
                    sortConfig.direction === 'asc' ? (
                      <LuChevronUp className="h-3 w-3" />
                    ) : (
                      <LuChevronDown className="h-3 w-3" />
                    )
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonTableRow key={i} columns={columns.length} />
            ))}
          </tbody>
        ) : data && data.length > 0 ? (
          <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={row.id || rowIndex}
                variants={slideUp}
                className={cn(
                  'border-b border-gray-100 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-gray-50'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-3 md:px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </motion.tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={columns.length} className="text-center">
                {emptyState || <EmptyState title="No data" description="No records found." />}
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}

export function TablePagination({ currentPage, totalPages, total, pageSize, onPageChange }) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 md:px-4 py-3 border-t border-gray-200 bg-white gap-2">
      <p className="text-sm text-gray-500 shrink-0">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-1 overflow-x-auto max-w-full">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 md:px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          Previous
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'px-2 md:px-3 py-1 text-sm rounded-md transition-colors shrink-0',
              page === currentPage
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 md:px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          Next
        </button>
      </div>
    </div>
  );
}