import { useState, useEffect } from 'react';
import { dbAPI } from '../services/api';
import type { FlaggedData, DashboardMetrics, DataTypeRisk, RecentAlert } from '../types/database';

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const [totalScans, totalViolations] = await Promise.all([
          dbAPI.getTotalScans(),
          dbAPI.getTotalViolations()
        ]);

        // Calculate derived metrics
        const dataProtected = Math.max(0, totalScans - totalViolations);
        const activeUsers = Math.floor(totalScans * 0.15); // Estimate based on scan volume

        setMetrics({
          totalScans,
          totalViolations,
          dataProtected,
          activeUsers
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard metrics');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { metrics, loading, error };
};

export const useDataTypeRisks = () => {
  const [risks, setRisks] = useState<DataTypeRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        setLoading(true);
        const data = await dbAPI.getDataTypeRisks();
        
        // Calculate risk scores based on violation patterns
        const totalViolations = data.reduce((sum, item) => sum + item.violations, 0);
        
        const processedRisks = data.map(item => {
          // Risk calculation based on frequency and recency
          const frequency = item.violations / totalViolations;
          const recency = new Date(item.latest_incident).getTime();
          const now = new Date().getTime();
          const daysSinceLastIncident = (now - recency) / (1000 * 60 * 60 * 24);
          
          // Higher risk for more frequent violations and recent incidents
          let riskScore = Math.min(100, (frequency * 100) + (item.avg_count * 10));
          if (daysSinceLastIncident < 1) riskScore += 20;
          else if (daysSinceLastIncident < 7) riskScore += 10;
          
          return {
            type: item.data_type,
            risk: Math.round(riskScore),
            violations: item.violations,
            percentage: frequency
          };
        });

        setRisks(processedRisks);
        setError(null);
      } catch (err) {
        setError('Failed to fetch risk data');
        console.error('Error fetching risks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRisks();
    const interval = setInterval(fetchRisks, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return { risks, loading, error };
};

export const useRecentAlerts = () => {
  const [alerts, setAlerts] = useState<RecentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await dbAPI.getRecentAlerts(10);
        
        const processedAlerts = data.map((item, index) => {
          // Determine severity based on data type
          const getSeverity = (dataType: string): 'critical' | 'high' | 'medium' | 'low' => {
            const type = dataType.toLowerCase();
            if (type.includes('ssn') || type.includes('social') || type.includes('credit') || type.includes('card')) {
              return 'critical';
            }
            if (type.includes('phone') || type.includes('email') || type.includes('nric')) {
              return 'high';
            }
            if (type.includes('address') || type.includes('name')) {
              return 'medium';
            }
            return 'low';
          };

          const severity = getSeverity(item.data_type);
          const now = new Date();
          const flaggedTime = new Date(item.last_flagged);
          const timeDiff = now.getTime() - flaggedTime.getTime();
          const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutesAgo = Math.floor(timeDiff / (1000 * 60));

          let timeAgo = '';
          if (hoursAgo > 0) {
            timeAgo = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
          } else {
            timeAgo = `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
          }

          return {
            id: item.id,
            type: item.data_type,
            severity,
            description: `${item.data_type} detected in user input (${item.count} occurrence${item.count > 1 ? 's' : ''})`,
            timestamp: timeAgo,
            status: hoursAgo < 1 ? 'active' : hoursAgo < 24 ? 'investigating' : 'resolved',
            dataType: item.data_type,
            confidence: Math.min(95, 70 + (item.count * 5)), // Higher confidence with more occurrences
            action: severity === 'critical' ? 'Blocked' : severity === 'high' ? 'Flagged' : 'Noted'
          } as RecentAlert;
        });

        setAlerts(processedAlerts);
        setError(null);
      } catch (err) {
        setError('Failed to fetch recent alerts');
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return { alerts, loading, error };
};

export const useViolationTrends = () => {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const data = await dbAPI.getViolationTrends(7);
        
        // Fill in missing days with zero values
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayData = data.find(d => d.date === dateStr);
          last7Days.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: dateStr,
            violations: dayData?.violations || 0,
            scans: dayData?.total_count || 0
          });
        }

        setTrends(last7Days);
        setError(null);
      } catch (err) {
        setError('Failed to fetch violation trends');
        console.error('Error fetching trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
    const interval = setInterval(fetchTrends, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return { trends, loading, error };
};