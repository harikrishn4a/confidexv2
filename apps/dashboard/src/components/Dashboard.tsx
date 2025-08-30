import { useEffect, useState } from 'react';
// import { AlertTriangle, Shield, Users, Activity, Eye, View, Text } from 'lucide-react';
// import MetricCard from './MetricCard';
// import ViolationChart from './ViolationChart';
// import RecentAlerts from './RecentAlerts';
// import DataTypeRisk from './DataTypeRisk';
// import { useDashboardMetrics } from '../hooks/useDatabase';
import axios from "axios";

interface FlaggedDataRow {
  id: number;            // The unique identifier for the flagged data
  name: string;          // The name of the employee or entity
  data_type: string;     // The type of sensitive data (e.g., NRIC, API_KEY)
  count: number;         // The number of times this data type has been flagged
  last_flagged: string;  // The timestamp of when the data was last flagged
}

const Dashboard = () => {
  // const { metrics: dbMetrics, loading, error } = useDashboardMetrics();
  const [flaggedData, setFlaggedData] = useState<FlaggedDataRow[]>([]);
  const [error, setError] = useState('');

  // Fetch all flagged data from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/")  // Your backend API to fetch all flagged data
      .then((response) => {
        setFlaggedData(response.data);  // Store the data in state
      })
      .catch((error) => {
        setError("Error fetching data");
        console.error("There was an error!", error);
      });
  }, []);

  console.log(flaggedData);


  // const formatNumber = (num: number) => {
  //   if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  //   if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  //   return num.toString();
  // };

  // const metrics = dbMetrics ? [
  //   {
  //     title: 'Total Scans',
  //     value: formatNumber(dbMetrics.totalScans),
  //     change: '+12%',
  //     trend: 'up' as const,
  //     icon: Eye,
  //     color: 'blue' as const
  //   },
  //   {
  //     title: 'Violations Detected',
  //     value: formatNumber(dbMetrics.totalViolations),
  //     change: '-8%',
  //     trend: 'down' as const,
  //     icon: AlertTriangle,
  //     color: 'red' as const
  //   },
  //   {
  //     title: 'Data Protected',
  //     value: formatNumber(dbMetrics.dataProtected),
  //     change: '+24%',
  //     trend: 'up' as const,
  //     icon: Shield,
  //     color: 'green' as const
  //   },
  //   {
  //     title: 'Active Users',
  //     value: formatNumber(dbMetrics.activeUsers),
  //     change: '+5%',
  //     trend: 'up' as const,
  //     icon: Users,
  //     color: 'purple' as const
  //   }
  // ] : [];

  // if (loading) {
  //   return (
  //     <div className="space-y-8">
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //         {[...Array(4)].map((_, i) => (
  //           <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
  //             <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  //             <div className="h-8 bg-gray-200 rounded w-1/2"></div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="bg-red-50 border border-red-200 rounded-lg p-6">
  //       <div className="flex items-center space-x-2">
  //         <AlertTriangle className="h-5 w-5 text-red-500" />
  //         <span className="text-red-700">Error loading dashboard data: {error}</span>
  //       </div>
  //     </div>
  //   );
  // }

  // return (
  //   <div className="space-y-8">
      
  //     {/* Metrics Grid */}
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //       {metrics.map((metric, index) => (
  //         <MetricCard key={index} {...metric} />
  //       ))}
  //     </div>

  //     {/* Charts Section */}
  //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  //       <div className="lg:col-span-2">
  //         <ViolationChart />
  //       </div>
  //       <div>
  //         <DataTypeRisk />
  //       </div>
  //     </div>

  //     {/* Recent Activity */}
  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //       <RecentAlerts />
  //       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  //         <div className="flex items-center justify-between mb-4">
  //           <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
  //           <Activity className="h-5 w-5 text-green-500" />
  //         </div>
  //         <div className="space-y-4">
  //           <div className="flex justify-between items-center">
  //             <span className="text-sm text-gray-600">Detection Engine</span>
  //             <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
  //           </div>
  //           <div className="flex justify-between items-center">
  //             <span className="text-sm text-gray-600">Data Processing</span>
  //             <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Normal</span>
  //           </div>
  //           <div className="flex justify-between items-center">
  //             <span className="text-sm text-gray-600">Alert System</span>
  //             <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
  //           </div>
  //           <div className="flex justify-between items-center">
  //             <span className="text-sm text-gray-600">Data Retention</span>
  //             <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Warning</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return(
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Flagged Data</h1>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message if any */}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border-b border-gray-300 py-2 px-4 text-left">ID</th>
            <th className="border-b border-gray-300 py-2 px-4 text-left">Name</th>
            <th className="border-b border-gray-300 py-2 px-4 text-left">Data Type</th>
            <th className="border-b border-gray-300 py-2 px-4 text-left">Count</th>
            <th className="border-b border-gray-300 py-2 px-4 text-left">Last Flagged</th>
          </tr>
        </thead>
        <tbody>
          {flaggedData.length > 0 ? (
            flaggedData.map((row) => (
              <tr key={row.id}>
                <td className="border-b border-gray-300 py-2 px-4">{row.id}</td>
                <td className="border-b border-gray-300 py-2 px-4">{row.name}</td>
                <td className="border-b border-gray-300 py-2 px-4">{row.data_type}</td>
                <td className="border-b border-gray-300 py-2 px-4">{row.count}</td>
                <td className="border-b border-gray-300 py-2 px-4">{row.last_flagged}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-2 px-4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
};

export default Dashboard;