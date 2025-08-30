import { Shield, AlertTriangle } from 'lucide-react';
import { useDataTypeRisks } from '../hooks/useDatabase';

const DataTypeRisk = () => {
  const { risks: riskData, loading, error } = useDataTypeRisks();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !riskData.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk by Data Type</h3>
        <div className="text-center py-8 text-gray-500">
          {error ? 'Error loading risk data' : 'No risk data available'}
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'bg-red-500';
    if (risk >= 60) return 'bg-orange-500';
    if (risk >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskBg = (risk: number) => {
    if (risk >= 80) return 'bg-red-50';
    if (risk >= 60) return 'bg-orange-50';
    if (risk >= 40) return 'bg-yellow-50';
    return 'bg-green-50';
  };

  const overallRisk = riskData.length > 0 
    ? riskData.reduce((sum, item) => sum + item.risk, 0) / riskData.length 
    : 0;

  const getRiskLevel = (risk: number) => {
    if (risk >= 80) return 'High';
    if (risk >= 60) return 'Medium';
    if (risk >= 40) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Risk by Data Type</h3>
        <Shield className="h-5 w-5 text-blue-500" />
      </div>

      <div className="space-y-4">
        {riskData.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${getRiskBg(item.risk)} hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">{item.type}</span>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{item.violations}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getRiskColor(item.risk)} transition-all duration-500`}
                  style={{ width: `${item.risk}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900">{item.risk}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overall Risk Score</span>
          <span className={`font-bold ${overallRisk >= 80 ? 'text-red-600' : overallRisk >= 60 ? 'text-orange-600' : overallRisk >= 40 ? 'text-yellow-600' : 'text-green-600'}`}>
            {getRiskLevel(overallRisk)} ({Math.round(overallRisk)}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default DataTypeRisk;