import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { logger } from '../utils/logger';

const analyticsService = new AnalyticsService();

export const getZoneStats = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    if (typeof zoneId !== 'string') return res.status(400).json({ message: 'Invalid zoneId' });
    const stats = await analyticsService.getZoneAnalytics(parseInt(zoneId));
    res.json(stats);
  } catch (error) {
    logger.error('Get zone stats error:', error);
    res.status(500).json({ message: 'Error getting analytics' });
  }
};

export const getDailyUptime = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    if (typeof zoneId !== 'string') return res.status(400).json({ message: 'Invalid zoneId' });
    const { days } = req.query;
    const stats = await analyticsService.getDailyUptime(
      parseInt(zoneId), 
      days ? parseInt(String(days)) : 7
    );
    res.json(stats);
  } catch (error) {
    logger.error('Get daily uptime error:', error);
    res.status(500).json({ message: 'Error getting uptime stats' });
  }
};

export const getGlobalOutageStats = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getOutageFrequency();
    res.json(stats);
  } catch (error) {
    logger.error('Get global outage stats error:', error);
    res.status(500).json({ message: 'Error getting global stats' });
  }
};
