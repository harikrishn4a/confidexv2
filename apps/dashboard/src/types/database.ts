export interface FlaggedData {
  id: number;
  data_type: string;
  count: number;
  last_flagged: string;
}

export interface DashboardMetrics {
  totalScans: number;
  totalViolations: number;
  dataProtected: number;
  activeUsers: number;
}

export interface ViolationTrend {
  date: string;
  violations: number;
  scans: number;
}

export interface DataTypeRisk {
  type: string;
  risk: number;
  violations: number;
  percentage: number;
}

export interface RecentAlert {
  id: number;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  dataType: string;
  confidence: number;
  action: string;
}