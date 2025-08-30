import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: LucideIcon;
  color: 'red' | 'amber' | 'green' | 'blue' | 'purple';
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  color,
  description
}) => {
  const colorClasses = {
    red: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      changeBg: trend === 'up' ? 'bg-red-100' : trend === 'down' ? 'bg-green-100' : 'bg-gray-100',
      changeText: trend === 'up' ? 'text-red-700' : trend === 'down' ? 'text-green-700' : 'text-gray-700'
    },
    amber: {
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      changeBg: trend === 'up' ? 'bg-red-100' : trend === 'down' ? 'bg-green-100' : 'bg-gray-100',
      changeText: trend === 'up' ? 'text-red-700' : trend === 'down' ? 'text-green-700' : 'text-gray-700'
    },
    green: {
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      changeBg: trend === 'up' ? 'bg-green-100' : trend === 'down' ? 'bg-red-100' : 'bg-gray-100',
      changeText: trend === 'up' ? 'text-green-700' : trend === 'down' ? 'text-red-700' : 'text-gray-700'
    },
    blue: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      changeBg: trend === 'up' ? 'bg-green-100' : trend === 'down' ? 'bg-red-100' : 'bg-gray-100',
      changeText: trend === 'up' ? 'text-green-700' : trend === 'down' ? 'text-red-700' : 'text-gray-700'
    },
    purple: {
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      changeBg: trend === 'up' ? 'bg-red-100' : trend === 'down' ? 'bg-green-100' : 'bg-gray-100',
      changeText: trend === 'up' ? 'text-red-700' : trend === 'down' ? 'text-green-700' : 'text-gray-700'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${classes.iconBg}`}>
          <Icon className={`h-6 w-6 ${classes.iconColor}`} />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default MetricCard;