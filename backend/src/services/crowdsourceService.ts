import { pool } from '../config/database';
import { logger } from '../utils/logger';

export class CrowdsourceService {
  async createReport(data: {
    campusZoneId: number;
    userId: number;
    reportedSource: 'grid' | 'generator' | 'off';
  }) {
    // Basic verification logic: if 3 different students report the same thing within 15 mins, mark as verified
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const result = await pool.query(
      `INSERT INTO crowdsourced_reports (campus_zone_id, user_id, reported_source)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.campusZoneId, data.userId, data.reportedSource]
    );
    
    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as report_count
       FROM crowdsourced_reports
       WHERE campus_zone_id = $1 AND reported_source = $2 AND created_at >= $3`,
      [data.campusZoneId, data.reportedSource, fifteenMinsAgo]
    );
    
    const reportCount = parseInt(countResult.rows[0].report_count);
    
    if (reportCount >= 3) {
      await pool.query(
        `UPDATE crowdsourced_reports 
         SET is_verified = true 
         WHERE campus_zone_id = $1 AND reported_source = $2 AND created_at >= $3`,
        [data.campusZoneId, data.reportedSource, fifteenMinsAgo]
      );
      return { ...result.rows[0], verified_now: true };
    }
    
    return result.rows[0];
  }

  async getRecentReports(zoneId: number) {
    const result = await pool.query(
      `SELECT cr.*, u.first_name || ' ' || u.last_name as reporter_name
       FROM crowdsourced_reports cr
       JOIN users u ON cr.user_id = u.id
       WHERE cr.campus_zone_id = $1 AND cr.created_at >= NOW() - INTERVAL '1 hour'
       ORDER BY cr.created_at DESC`,
      [zoneId]
    );
    return result.rows;
  }
}
