import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LuSend, LuCalendar, LuTrendingUp, LuCircleAlert, LuFileText, LuFileBadge, LuUsers, LuCalendarClock, LuPenLine, LuUserPlus, LuUpload } from 'react-icons/lu';
import { pageTransition, staggerContainer } from '@/animations/variants';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/cards/StatCard';
import { EmailVolumeChart } from '@/components/charts/EmailVolumeChart';
import { SuccessRateChart } from '@/components/charts/SuccessRateChart';
import { Button } from '@/components/common/Button';
import { SkeletonLoader, SkeletonCard } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { formatRelativeDate } from '@/utils/formatDate';
import { useDashboard } from '@/hooks/useDashboard';
import { motion as m } from 'framer-motion';
import dayjs from 'dayjs';

export function DashboardPage() {
  const navigate = useNavigate();
  const { stats } = useDashboard();

  const isLoading = stats.isLoading;
  const hasError = stats.error;

  if (isLoading) {
    return (
      <motion.div variants={pageTransition} initial="hidden" animate="visible">
        <SkeletonLoader height="h-8" width="w-48" className="mb-2" />
        <SkeletonLoader height="h-4" width="w-64" className="mb-4 md:mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </motion.div>
    );
  }

  if (hasError) {
    return <ErrorState error={stats.error} onRetry={() => window.location.reload()} />;
  }

  const rawData = stats.data?.data?.data || {};
  const summary = rawData.summary || {};
  const counts = rawData.counts || {};
  const activityData = rawData.recentActivity || [];
  const chartData = rawData.chartData || [];

  const totalSent = summary.totalSent || 0;
  const successRate = totalSent > 0 ? Math.round((summary.successCount / totalSent) * 100) : 0;

  const weeklyData = chartData && chartData.length > 0
    ? chartData.map((item) => ({
        label: dayjs(item.date).format('ddd'),
        count: item.sent || 0,
      }))
    : [];

  const isAllZero = !totalSent && !summary.todaySent && !counts.templates && !counts.contacts;

  if (isAllZero) {
    return (
      <motion.div variants={pageTransition} initial="hidden" animate="visible">
        <PageHeader title="Dashboard" subtitle="Here's what's happening with your emails." />
        <EmptyState
          icon={LuSend}
          title="Let's get started"
          description="Send your first cold email."
          action={{ label: 'Compose Email', onClick: () => navigate('/compose') }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible">
      <PageHeader title="Dashboard" subtitle="Here's what's happening with your emails." />

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-6"
      >
        <StatCard icon={LuSend} label="Total Emails Sent" value={totalSent} color="blue" />
        <StatCard icon={LuCalendar} label="Today's Emails" value={summary.todaySent || 0} color="green" />
        <StatCard icon={LuTrendingUp} label="Success Rate" value={`${successRate}%`} color="emerald" />
        <StatCard icon={LuCircleAlert} label="Failed Emails" value={summary.failureCount || 0} color="red" />
        <StatCard icon={LuFileText} label="Templates" value={counts.templates || 0} color="purple" />
        <StatCard icon={LuFileBadge} label="Resumes" value={counts.resumes || 0} color="orange" />
        <StatCard icon={LuUsers} label="Contacts" value={counts.contacts || 0} color="cyan" />
        <StatCard icon={LuCalendarClock} label="Scheduled" value={counts.scheduled || 0} color="indigo" />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <EmailVolumeChart data={weeklyData} />
        </div>
        <div>
          <SuccessRateChart
            successRate={successRate}
            failedRate={100 - successRate}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
        <Button leftIcon={LuPenLine} onClick={() => navigate('/compose')}>
          Compose Email
        </Button>
        <Button variant="outline" leftIcon={LuUserPlus}>
          Add Contact
        </Button>
        <Button variant="outline" leftIcon={LuUpload}>
          Upload Resume
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <h3 className="text-sm md:text-base font-medium text-gray-900 mb-3 md:mb-4">Recent Activity</h3>
        {activityData.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {activityData.slice(0, 5).map((item, i) => (
              <div key={item._id || i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-2.5 w-2.5 rounded-full mt-1.5 ${
                    item.status === 'sent' ? 'bg-green-500' :
                    item.status === 'failed' ? 'bg-red-500' :
                    item.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  {i < Math.min(activityData.length, 5) - 1 && (
                    <div className="w-px h-full bg-gray-100 min-h-[24px]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    {item.recipientName
                      ? `Email ${item.status === 'sent' ? 'sent' : 'failed'} to ${item.recipientName}`
                      : item.recipientEmail
                        ? `Email ${item.status === 'sent' ? 'sent' : 'failed'} to ${item.recipientEmail}`
                        : `Email ${item.status || 'processed'}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.sentAt ? formatRelativeDate(item.sentAt) : item.createdAt ? formatRelativeDate(item.createdAt) : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}