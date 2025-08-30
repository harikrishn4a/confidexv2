const API_BASE = import.meta.env.VITE_API_BASE || 'http://172.31.17.250:8080';
const DB_NAME = import.meta.env.VITE_DB_NAME || 'sensitive_data_log';

export class DatabaseAPI {
  private async executeQuery(query: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          database: DB_NAME,
          query: query
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async getFlaggedData(): Promise<any[]> {
    const query = 'SELECT * FROM flagged_data ORDER BY last_flagged DESC';
    return this.executeQuery(query);
  }

  async getTotalScans(): Promise<number> {
    const query = 'SELECT COUNT(*) as total FROM flagged_data';
    const result = await this.executeQuery(query);
    return result[0]?.total || 0;
  }

  async getTotalViolations(): Promise<number> {
    const query = 'SELECT SUM(count) as total FROM flagged_data';
    const result = await this.executeQuery(query);
    return result[0]?.total || 0;
  }

  async getDataTypeStats(): Promise<any[]> {
    const query = `
      SELECT 
        data_type,
        SUM(count) as total_violations,
        COUNT(*) as occurrences,
        MAX(last_flagged) as latest_flagged
      FROM flagged_data 
      GROUP BY data_type 
      ORDER BY total_violations DESC
    `;
    return this.executeQuery(query);
  }

  async getViolationTrends(days: number = 7): Promise<any[]> {
    const query = `
      SELECT 
        DATE(last_flagged) as date,
        COUNT(*) as violations,
        SUM(count) as total_count
      FROM flagged_data 
      WHERE last_flagged >= datetime('now', '-${days} days')
      GROUP BY DATE(last_flagged)
      ORDER BY date ASC
    `;
    return this.executeQuery(query);
  }

  async getRecentAlerts(limit: number = 10): Promise<any[]> {
    const query = `
      SELECT * FROM flagged_data 
      ORDER BY last_flagged DESC 
      LIMIT ${limit}
    `;
    return this.executeQuery(query);
  }

  async getDataTypeRisks(): Promise<any[]> {
    const query = `
      SELECT 
        data_type,
        SUM(count) as violations,
        COUNT(*) as incidents,
        MAX(last_flagged) as latest_incident,
        AVG(count) as avg_count
      FROM flagged_data 
      GROUP BY data_type 
      ORDER BY violations DESC
    `;
    return this.executeQuery(query);
  }
}

export const dbAPI = new DatabaseAPI();