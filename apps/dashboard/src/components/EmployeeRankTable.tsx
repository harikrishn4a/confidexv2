import React from 'react';
import { AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

interface EmployeeRisk {
  name: string;
  totalViolations: number;
  riskDataTypes: string[];
  lastViolation: string;
  riskScore: number;
}

interface EmployeeRankTableProps {
  employees: EmployeeRisk[];
}

const EmployeeRankTable: React.FC<EmployeeRankTableProps> = ({ employees }) => {
  const getRiskLevel = (score: number) => {
    if (score >= 20) return { level: 'critical', color: 'red' };
    if (score >= 10) return { level: 'high', color: 'amber' };
    if (score >= 5) return { level: 'medium', color: 'yellow' };
    return { level: 'low', color: 'green' };
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (rank === 2) return <AlertTriangle className="h-5 w-5 text-orange-400" />;
    if (rank === 3) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
  };

  console.log(employees);
  if (employees.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <p className="text-gray-600">No employee violations detected</p>
        <p className="text-sm text-gray-500">All employees are following security protocols</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Rank</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Employee</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Risk Score</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Violations</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Data Types</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Last Violation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.slice(0, 10).map((employee, index) => {
              const rank = index + 1;
              const risk = getRiskLevel(employee.riskScore);
              
              return (
                <tr key={employee.name} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {getRankIcon(rank)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                        rank === 1 ? 'bg-red-500' :
                        rank === 2 ? 'bg-amber-500' :
                        rank === 3 ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}>
                        {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">Employee</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xl font-bold ${
                        risk.color === 'red' ? 'text-red-600' :
                        risk.color === 'amber' ? 'text-amber-600' :
                        risk.color === 'yellow' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {employee.riskScore}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        risk.color === 'red' ? 'bg-red-100 text-red-800' :
                        risk.color === 'amber' ? 'bg-amber-100 text-amber-800' :
                        risk.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.level}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        employee.totalViolations >= 10 ? 'text-red-500' :
                        employee.totalViolations >= 5 ? 'text-amber-500' :
                        'text-gray-400'
                      }`} />
                      <span className="font-semibold text-gray-900">{employee.totalViolations}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {employee.riskDataTypes.slice(0, 2).map((type) => (
                        <span key={type} className={`px-2 py-1 text-xs font-medium rounded-full ${
                          type === 'NRIC' ? 'bg-red-100 text-red-800' :
                          type === 'API_KEY' ? 'bg-amber-100 text-amber-800' :
                          type === 'CREDIT_CARD' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {type}
                        </span>
                      ))}
                      {employee.riskDataTypes.length > 2 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          +{employee.riskDataTypes.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(employee.lastViolation).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeRankTable;