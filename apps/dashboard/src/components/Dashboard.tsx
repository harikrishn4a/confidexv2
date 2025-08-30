import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Users, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import axios from "axios";
import MetricCard from './MetricCard';
import EmployeeRankTable from './EmployeeRankTable';
import CriticalDataTable from './CriticalDataTable';

interface FlaggedDataRow {
  id: number;
  name: string;
  data_type: string;
  count: number;
  last_flagged: string;
}

interface CriticalDataType {
  type: string;
  totalCount: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  affectedEmployees: number;
}

interface EmployeeRisk {
  name: string;
  totalViolations: number;
  riskDataTypes: string[];
  lastViolation: string;
  riskScore: number;
}

const Dashboard = () => {
  const [flaggedData, setFlaggedData] = useState<FlaggedDataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/")
      .then((response) => {
        setFlaggedData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data");
        setLoading(false);
        console.error("There was an error!", error);
      });
  }, []);

  // Process data to get top 4 most critical data types
  const getCriticalDataTypes = (): CriticalDataType[] => {
    const dataTypeMap = new Map<string, { totalCount: number; employees: Set<string>; lastFlagged: string }>();
    
    flaggedData.forEach(row => {
      const existing = dataTypeMap.get(row.data_type);
      if (existing) {
        existing.totalCount += row.count;
        existing.employees.add(row.name);
        if (new Date(row.last_flagged) > new Date(existing.lastFlagged)) {
          existing.lastFlagged = row.last_flagged;
        }
      } else {
        dataTypeMap.set(row.data_type, {
          totalCount: row.count,
          employees: new Set([row.name]),
          lastFlagged: row.last_flagged
        });
      }
    });

    const getRiskLevel = (count: number): 'critical' | 'high' | 'medium' | 'low' => {
      if (count >= 15) return 'critical';
      if (count >= 10) return 'high';
      if (count >= 5) return 'medium';
      return 'low';
    };

    return Array.from(dataTypeMap.entries())
      .map(([type, data]) => ({
        type,
        totalCount: data.totalCount,
        riskLevel: getRiskLevel(data.totalCount),
        affectedEmployees: data.employees.size
      }))
      .sort((a, b) => b.totalCount - a.totalCount)
      .slice(0, 4);
  };

  // Process data to get employee risk rankings
  const getEmployeeRankings = (): EmployeeRisk[] => {
    const employeeMap = new Map<string, { totalViolations: number; dataTypes: Set<string>; lastViolation: string }>();
    
    flaggedData.forEach(row => {
      const existing = employeeMap.get(row.name);
      if (existing) {
        existing.totalViolations += row.count;
        existing.dataTypes.add(row.data_type);
        if (new Date(row.last_flagged) > new Date(existing.lastViolation)) {
          existing.lastViolation = row.last_flagged;
        }
      } else {
        employeeMap.set(row.name, {
          totalViolations: row.count,
          dataTypes: new Set([row.data_type]),
          lastViolation: row.last_flagged
        });
      }
    });

    return Array.from(employeeMap.entries())
      .map(([name, data]) => ({
        name,
        totalViolations: data.totalViolations,
        riskDataTypes: Array.from(data.dataTypes),
        lastViolation: data.lastViolation,
        riskScore: data.totalViolations * data.dataTypes.size // Simple risk score calculation
      }))
      .sort((a, b) => b.riskScore - a.riskScore);
  };

  const criticalDataTypes = getCriticalDataTypes();
  const employeeRankings = getEmployeeRankings();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const overviewMetrics = [
    {
      title: 'Total Violations',
      value: formatNumber(flaggedData.reduce((sum, row) => sum + row.count, 0)),
      change: '+12%',
      trend: 'up' as const,
      icon: AlertTriangle,
      color: 'red' as const,
      description: 'Total security violations detected'
    },
    {
      title: 'At-Risk Employees',
      value: formatNumber(employeeRankings.length),
      change: '-5%',
      trend: 'down' as const,
      icon: Users,
      color: 'amber' as const,
      description: 'Employees with flagged activities'
    },
    {
      title: 'Data Types Exposed',
      value: formatNumber(criticalDataTypes.length),
      change: '+8%',
      trend: 'up' as const,
      icon: Shield,
      color: 'purple' as const,
      description: 'Unique sensitive data types found'
    },
    {
      title: 'Active Monitoring',
      value: '24/7',
      change: '100%',
      trend: 'stable' as const,
      icon: Activity,
      color: 'green' as const,
      description: 'Continuous security monitoring'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Connection Error</h3>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor data security violations across your organization with CONFIDEX</p>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">System Active</span>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Critical Data Types Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Most Critical Data Types</h2>
                <p className="text-gray-600 text-sm">Top 4 data types with highest violation counts</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
          <CriticalDataTable dataTypes={criticalDataTypes} />
        </div>

        {/* Employee Risk Rankings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Employee Risk Rankings</h2>
                {employeeRankings.length > 10 && (
                    <p className="text-sm text-gray-500">
                      Top 10 Security-Risk Employees
                    </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>Risk Score = Violations × Data Types</span>
            </div>
          </div>
          <EmployeeRankTable employees={employeeRankings} />
        </div>

        {/* All Flagged Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">All Flagged Data</h2>
                <p className="text-gray-600 text-sm">Complete list of all security violations</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Total records: {flaggedData.length}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {/* <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">ID</th> */}
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Employee</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Data Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Count</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Last Flagged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {flaggedData.length > 0 ? (
                  flaggedData
                  .sort((a, b) => {
                    const dateA = new Date(a.last_flagged);
                    const dateB = new Date(b.last_flagged);
                    return dateB < dateA ? -1 : 1; // Sort latest to earliest
                  })
                  .map((row, index) => (
                    <tr key={row.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                      {/* <td className="py-3 px-4 text-sm text-gray-900">{row.id}</td> */}
                      <td className="py-3 px-4 text-sm text-gray-900 font-normal">{row.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          row.data_type === 'NRIC' ? 'bg-red-100 text-red-800' :
                          row.data_type === 'API_KEY' ? 'bg-amber-100 text-amber-800' :
                          row.data_type === 'CREDIT_CARD' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {row.data_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          row.count >= 10 ? 'text-red-600' :
                          row.count >= 5 ? 'text-amber-600' :
                          'text-gray-600'
                        }`}>
                          {row.count}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(row.last_flagged).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No flagged data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;