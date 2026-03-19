import { pool } from '../config/database';

export class AnalyticsService {
  async getZoneAnalytics(zoneId: number) {
    const query = `
      SELECT 
        power_source,
        COUNT(*) as occurrence_count,
        SUM(EXTRACT(EPOCH FROM (LEAD(timestamp) OVER (ORDER BY timestamp) - timestamp))) / 3600 as total_hours
      FROM power_status_history
      WHERE campus_zone_id = $1
      GROUP BY power_source
    `;
    
    const result = await pool.query(query, [zoneId]);
    return result.rows;
  }

  async getDailyUptime(zoneId: number, days: number = 7) {
    const query = `
      SELECT 
        DATE(timestamp) as date,
        power_source,
        COUNT(*) as count
      FROM power_status_history
      WHERE campus_zone_id = $1 AND timestamp >= NOW() - INTERVAL '$2 days'
      GROUP BY DATE(timestamp), power_source
      ORDER BY date DESC
    `;
    
    const result = await pool.query(query, [zoneId, days]);
    return result.rows;
  }

  async getOutageFrequency() {
    const query = `
      SELECT 
        cz.name as zone_name,
        COUNT(*) filter (where power_source = 'off') as outage_count,
        COUNT(*) filter (where power_source = 'generator') as generator_count
      FROM power_status_history psh
      JOIN campus_zones cz ON psh.campus_zone_id = cz.id
      WHERE psh.timestamp >= NOW() - INTERVAL '30 days'
      GROUP BY cz.name
      ORDER BY outage_count DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }
}
