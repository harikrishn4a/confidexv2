import React from 'react';
import { AlertTriangle, Shield, TrendingUp, Users, Activity, Eye } from 'lucide-react';
import MetricCard from './MetricCard';
import ViolationChart from './ViolationChart';
import RecentAlerts from './RecentAlerts';
import DataTypeRisk from './DataTypeRisk';
import { useDashboardMetrics } from '../hooks/useDatabase';

const Dashboard = () => {
  const { metrics: dbMetrics, loading, error } = useDashboardMetrics();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const metrics = dbMetrics ? [
    {
      title: 'Total Scans',
      value: formatNumber(dbMetrics.totalScans),
      change: '+12%',
      trend: 'up' as const,
      icon: Eye,
      color: 'blue' as const
    },
    {
      title: 'Violations Detected',
      value: formatNumber(dbMetrics.totalViolations),
      change: '-8%',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'red' as const
    },
    {
      title: 'Data Protected',
      value: formatNumber(dbMetrics.dataProtected),
      change: '+24%',
      trend: 'up' as const,
      icon: Shield,
      color: 'green' as const
    },
    {
      title: 'Active Users',
      value: formatNumber(dbMetrics.activeUsers),
      change: '+5%',
      trend: 'up' as const,
      icon: Users,
      color: 'purple' as const
    }
  ] : [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">Error loading dashboard data: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ViolationChart />
        </div>
        <div>
          <DataTypeRisk />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlerts />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <Activity className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Detection Engine</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data Processing</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Normal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Alert System</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data Retention</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Warning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;