import { Request, Response } from 'express';
import { CrowdsourceService } from '../services/crowdsourceService';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const crowdsourceService = new CrowdsourceService();

export const reportOutage = async (req: AuthRequest, res: Response) => {
  try {
    const { campusZoneId, reportedSource } = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const report = await crowdsourceService.createReport({
      campusZoneId,
      userId,
      reportedSource,
    });
    
    if (report.verified_now) {
      const io = req.app.get('io');
      io.emit('powerStatusReportVerified', { 
        campusZoneId, 
        reportedSource, 
        message: 'Verified student report' 
      });
    }
    
    res.status(201).json(report);
  } catch (error) {
    logger.error('Report outage error:', error);
    res.status(500).json({ message: 'Error reporting outage' });
  }
};

export const getRecentReports = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    if (typeof zoneId !== 'string') return res.status(400).json({ message: 'Invalid zoneId' });
    const reports = await crowdsourceService.getRecentReports(parseInt(zoneId));
    res.json(reports);
  } catch (error) {
    logger.error('Get recent reports error:', error);
    res.status(500).json({ message: 'Error getting reports' });
  }
};
