import { pool } from '../config/database';
import { PredictionResult } from '../models';
import { logger } from '../utils/logger';

export class PredictionService {
  async getPredictions(zoneId: number, limit: number = 24): Promise<PredictionResult[]> {
    const result = await pool.query(
      `SELECT * FROM prediction_results 
       WHERE campus_zone_id = $1 AND prediction_for >= NOW()
       ORDER BY prediction_for ASC
       LIMIT $2`,
      [zoneId, limit]
    );
    return result.rows;
  }

  async getAllPredictions(): Promise<PredictionResult[]> {
    const result = await pool.query(
      `WITH LatestPredictions AS (
        SELECT DISTINCT ON (campus_zone_id) *
        FROM prediction_results
        WHERE prediction_for >= NOW()
        ORDER BY campus_zone_id, prediction_for ASC
      )
      SELECT * FROM LatestPredictions`
    );
    return result.rows;
  }

  // This would typically call an external ML service
  async generateMockPredictions(zoneId: number) {
    const predictions: Partial<PredictionResult>[] = [];
    const now = new Date();
    
    for (let i = 1; i <= 24; i++) {
      const predictionDate = new Date(now.getTime() + i * 60 * 60 * 1000);
      const predictedSource = Math.random() > 0.3 ? 'grid' : (Math.random() > 0.5 ? 'generator' : 'off');
      
      predictions.push({
        campus_zone_id: zoneId,
        predicted_source: predictedSource as any,
        confidence_score: Math.random() * 100,
        prediction_for: predictionDate,
        model_version: 'v1.0.mock',
      });
    }
    
    // Clear old mock predictions and insert new ones
    await pool.query('DELETE FROM prediction_results WHERE campus_zone_id = $1 AND model_version = $2', [zoneId, 'v1.0.mock']);
    
    for (const p of predictions) {
      await pool.query(
        `INSERT INTO prediction_results (campus_zone_id, predicted_source, confidence_score, prediction_for, model_version)
         VALUES ($1, $2, $3, $4, $5)`,
        [p.campus_zone_id, p.predicted_source, p.confidence_score, p.prediction_for, p.model_version]
      );
    }
    
    return predictions;
  }
}
