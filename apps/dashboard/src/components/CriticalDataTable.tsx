import React from 'react';
import { AlertTriangle, AlertCircle, Shield, Info } from 'lucide-react';

interface CriticalDataType {
  type: string;
  totalCount: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  affectedEmployees: number;
}

interface CriticalDataTableProps {
  dataTypes: CriticalDataType[];
}

const CriticalDataTable: React.FC<CriticalDataTableProps> = ({ dataTypes }) => {
  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return AlertTriangle;
      case 'high': return AlertCircle;
      case 'medium': return Shield;
      default: return Info;
    }
  };

  const getRiskStyle = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200'
        };
      case 'high':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          border: 'border-amber-200'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200'
        };
      default:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200'
        };
    }
  };

  if (dataTypes.length === 0) {
    return (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <p className="text-gray-600">No critical data types detected</p>
        <p className="text-sm text-gray-500">Your system appears secure</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {dataTypes.map((dataType) => {
        const RiskIcon = getRiskIcon(dataType.riskLevel);
        const riskStyle = getRiskStyle(dataType.riskLevel);
        
        return (
          <div 
            key={dataType.type} 
            className={`p-6 rounded-xl border-2 ${riskStyle.border} ${riskStyle.bg} hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white/50`}>
                  <RiskIcon className={`h-5 w-5 ${riskStyle.text}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${riskStyle.text} text-lg`}>{dataType.type}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${riskStyle.bg} ${riskStyle.text} border ${riskStyle.border}`}>
                    {dataType.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${riskStyle.text}`}>{dataType.totalCount}</div>
                <div className="text-xs text-gray-600">violations</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Affected employees:</span>
              <span className={`font-semibold ${riskStyle.text}`}>{dataType.affectedEmployees}</span>
            </div>
            
            <div className="mt-3 w-full bg-white/30 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  dataType.riskLevel === 'critical' ? 'bg-red-600' :
                  dataType.riskLevel === 'high' ? 'bg-amber-600' :
                  dataType.riskLevel === 'medium' ? 'bg-yellow-600' :
                  'bg-blue-600'
                }`}
                style={{ width: `${Math.min((dataType.totalCount / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CriticalDataTable;