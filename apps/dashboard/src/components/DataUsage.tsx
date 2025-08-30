import React, { useState } from 'react';
import { BarChart3, PieChart, Activity, TrendingUp, Calendar } from 'lucide-react';
import { useDataTypeRisks, useDashboardMetrics } from '../hooks/useDatabase';

const DataUsage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const { risks: usageData, loading: risksLoading } = useDataTypeRisks();
  const { metrics, loading: metricsLoading } = useDashboardMetrics();

  // Transform database data for display
  const processedUsageData = usageData.map(item => ({
    category: item.type,
    scanned: item.violations * 10, // Estimate scanned data based on violations
    violations: item.violations,
    percentage: item.percentage
  }));

  const loading = risksLoading || metricsLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Data Usage Analytics</h2>
            <p className="text-gray-600 mt-1">Track how your data is being processed and analyzed</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Activity</h3>
            <Activity className="h-5 w-5 text-blue-500" />
          </div>
          
          <div className="text-center py-8">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {metrics?.totalScans || 0}
            </div>
            <div className="text-sm text-gray-600">Total Scans Today</div>
            <div className="mt-4 text-2xl font-bold text-red-600">
              {metrics?.totalViolations || 0}
            </div>
            <div className="text-sm text-gray-600">Violations Detected</div>
          </div>
        </div>

        {/* Data Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Data Categories</h3>
            <PieChart className="h-5 w-5 text-purple-500" />
          </div>
          
          <div className="space-y-4">
            {processedUsageData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.scanned.toLocaleString()}</span>
                    <span className="text-xs text-red-600">({item.violations} violations)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.percentage > 0.15 ? 'bg-red-500' : item.percentage > 0.10 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(item.percentage * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Violation Rate: {(item.percentage * 100).toFixed(2)}%</span>
                  <span className={item.percentage > 0.15 ? 'text-red-600' : item.percentage > 0.10 ? 'text-yellow-600' : 'text-green-600'}>
                    {item.percentage > 0.15 ? 'High Risk' : item.percentage > 0.10 ? 'Medium Risk' : 'Low Risk'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Usage Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{(metrics?.totalScans || 0).toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Total Data Points Scanned</div>
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs">+18% from last week</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{(metrics?.totalViolations || 0).toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Privacy Violations Found</div>
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
              <span className="text-xs">-12% from last week</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {metrics ? (((metrics.totalScans - metrics.totalViolations) / metrics.totalScans * 100) || 0).toFixed(2) : '0.00'}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Protection Rate</div>
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs">+0.3% from last week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUsage;