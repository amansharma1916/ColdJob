import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getDashboardStats } from '@/api/dashboardApi';

export function useDashboard() {
  const stats = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATS],
    queryFn: getDashboardStats,
    staleTime: 60_000,
  });

  return { stats };
}