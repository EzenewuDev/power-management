import { pool } from '../config/database';
import { PowerStatus, PowerStatusWithZone } from '../models';
import { logger } from '../utils/logger';

export class PowerService {
  async getCurrentStatus(): Promise<PowerStatusWithZone[]> {
    const query = `
      WITH LatestStatus AS (
        SELECT DISTINCT ON (campus_zone_id) *
        FROM power_status_history
        ORDER BY campus_zone_id, timestamp DESC
      )
      SELECT 
        cz.id as campus_zone_id,
        cz.name as campus_zone_name,
        cz.fuel_level as fuel_level,
        ls.id as id,
        COALESCE(ls.power_source, 'off') as power_source,
        COALESCE(ls.status, 'System initialized') as status,
        COALESCE(u.first_name || ' ' || u.last_name, 'LCU Administrator') as changed_by_name,
        COALESCE(ls.timestamp, cz.created_at) as timestamp
      FROM campus_zones cz
      LEFT JOIN LatestStatus ls ON ls.campus_zone_id = cz.id
      LEFT JOIN users u ON ls.changed_by = u.id
      WHERE cz.is_active = true
      ORDER BY cz.name ASC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  async getStatusHistory(zoneId?: number, limit: number = 50): Promise<PowerStatusWithZone[]> {
    let query = `
      SELECT 
        psh.*, 
        cz.name as campus_zone_name,
        COALESCE(u.first_name || ' ' || u.last_name, 'System') as changed_by_name
      FROM power_status_history psh
      JOIN campus_zones cz ON psh.campus_zone_id = cz.id
      LEFT JOIN users u ON psh.changed_by = u.id
    `;
    
    const params: any[] = [];
    if (zoneId) {
      query += ` WHERE psh.campus_zone_id = $1`;
      params.push(zoneId);
    }
    
    query += ` ORDER BY psh.timestamp DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  async updatePowerStatus(statusData: {
    campusZoneId: number;
    powerSource: 'grid' | 'generator' | 'off';
    status: string;
    changedBy: number;
    notes?: string;
  }): Promise<PowerStatus> {
    const result = await pool.query(
      `INSERT INTO power_status_history (campus_zone_id, power_source, status, changed_by, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        statusData.campusZoneId,
        statusData.powerSource,
        statusData.status,
        statusData.changedBy,
        statusData.notes,
      ]
    );
    
    return result.rows[0];
  }

  async getAllZones() {
    const result = await pool.query('SELECT * FROM campus_zones WHERE is_active = true ORDER BY name');
    return result.rows;
  }

  async createZone(name: string, description?: string) {
    const result = await pool.query(
      'INSERT INTO campus_zones (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return result.rows[0];
  }
}
