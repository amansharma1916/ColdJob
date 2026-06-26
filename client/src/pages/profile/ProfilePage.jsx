import { motion } from 'framer-motion';
import { LuSettings, LuMail, LuSend, LuFileText, LuUsers, LuFileBadge } from 'react-icons/lu';
import { pageTransition } from '@/animations/variants';
import { PageHeader } from '@/components/common/PageHeader';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { StatCard } from '@/components/cards/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { useNavigate } from 'react-router-dom';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats } = useDashboard();

  const statsData = stats.data?.data?.data.counts || {};
  const statsSummary = stats.data?.data?.data.summary || {};


  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <SkeletonLoader height="h-8" width="w-48" className="mb-6" />
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <SkeletonLoader height="h-20 w-20" rounded="rounded-full" className="mx-auto mb-4" />
          <SkeletonLoader height="h-5" width="w-32" className="mx-auto mb-2" />
          <SkeletonLoader height="h-4" width="w-48" className="mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" className="max-w-2xl mx-auto">
      <PageHeader title="Profile" />

      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center mb-6">
        <div className="flex justify-center mb-4">
          <Avatar src={user?.avatar} name={user.name} size="xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h2>
        <p className="text-sm text-gray-500 mb-3">{user.email}</p>
        <Badge variant="success" size="md" className="mb-4">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
            Connected via Google
          </div>
        </Badge>
        <div>
          <Button variant="outline" leftIcon={LuSettings} onClick={() => navigate('/settings')}>
            Edit in Settings
          </Button>
        </div>
      </div>

      <h3 className="text-base font-medium text-gray-900 mb-4">Usage Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={LuSend} label="Emails Sent" value={statsSummary.totalSent || 0} color="blue" />
        <StatCard icon={LuFileText} label="Templates" value={statsData.templates || 0} color="purple" />
        <StatCard icon={LuUsers} label="Contacts" value={statsData.contacts || 0} color="cyan" />
        <StatCard icon={LuFileBadge} label="Resumes" value={statsData.resumes || 0} color="orange" />
      </div>
    </motion.div>
  );
}