import React, { useState } from 'react';
import { AlertTriangle, Shield, TrendingUp, Users, Database, Lock } from 'lucide-react';

const RiskAssessment = () => {
  const [selectedComponent, setSelectedComponent] = useState('all');

  const riskComponents = [
    {
      id: 'chat-interface',
      name: 'Chat Interface',
      riskScore: 87,
      category: 'High Risk',
      vulnerabilities: ['Direct PII Input', 'Unfiltered Text', 'Real-time Processing'],
      recommendations: ['Implement input validation', 'Add real-time filtering', 'Enable data masking'],
      violations: 45,
      users: 1240
    },
    {
      id: 'file-upload',
      name: 'File Upload System',
      riskScore: 92,
      category: 'Critical Risk',
      vulnerabilities: ['Document Content Scanning', 'Metadata Exposure', 'Bulk Data Processing'],
      recommendations: ['Add pre-upload screening', 'Implement metadata stripping', 'Enable file encryption'],
      violations: 23,
      users: 340
    },
    {
      id: 'user-profiles',
      name: 'User Profiles',
      riskScore: 34,
      category: 'Low Risk',
      vulnerabilities: ['Profile Data Access', 'Session Management'],
      recommendations: ['Regular access reviews', 'Enhanced authentication'],
      violations: 8,
      users: 890
    },
    {
      id: 'analytics-engine',
      name: 'Analytics Engine',
      riskScore: 71,
      category: 'Medium Risk',
      vulnerabilities: ['Data Aggregation', 'Pattern Recognition', 'Historical Analysis'],
      recommendations: ['Anonymize data sets', 'Implement differential privacy', 'Regular audits'],
      violations: 12,
      users: 2100
    },
    {
      id: 'api-endpoints',
      name: 'API Endpoints',
      riskScore: 56,
      category: 'Medium Risk',
      vulnerabilities: ['Data Transmission', 'Third-party Integration'],
      recommendations: ['API rate limiting', 'Enhanced encryption', 'Access logging'],
      violations: 18,
      users: 560
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return 'bg-red-50 border-red-200';
    if (score >= 60) return 'bg-orange-50 border-orange-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredComponents = selectedComponent === 'all' 
    ? riskComponents 
    : riskComponents.filter(comp => comp.category.toLowerCase().includes(selectedComponent));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Risk Assessment</h2>
            <p className="text-gray-600 mt-1">Evaluate privacy risks across system components</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Components</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-red-600">Critical</div>
          <div className="text-sm text-gray-600 mt-1">1 Component</div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">High</div>
          <div className="text-sm text-gray-600 mt-1">1 Component</div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">Medium</div>
          <div className="text-sm text-gray-600 mt-1">2 Components</div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-green-600">Low</div>
          <div className="text-sm text-gray-600 mt-1">1 Component</div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
          </div>
        </div>
      </div>

      {/* Component Risk Details */}
      <div className="grid grid-cols-1 gap-6">
        {filteredComponents.map((component) => (
          <div
            key={component.id}
            className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${getRiskBgColor(component.riskScore)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Database className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                  <p className="text-sm text-gray-600">{component.category}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getRiskColor(component.riskScore)}`}>
                  {component.riskScore}
                </div>
                <div className="text-sm text-gray-600">Risk Score</div>
              </div>
            </div>

            {/* Risk Score Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Risk Level</span>
                <span className="text-sm text-gray-600">{component.riskScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${getProgressColor(component.riskScore)}`}
                  style={{ width: `${component.riskScore}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-600">{component.violations} violations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">{component.users.toLocaleString()} users</span>
              </div>
            </div>

            {/* Vulnerabilities and Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                  Vulnerabilities
                </h4>
                <ul className="space-y-2">
                  {component.vulnerabilities.map((vuln, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {vuln}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <Lock className="h-4 w-4 text-green-500 mr-2" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {component.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskAssessment;