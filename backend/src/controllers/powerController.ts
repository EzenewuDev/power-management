import { Request, Response } from 'express';
import { PowerService } from '../services/powerService';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const powerService = new PowerService();

export const getCurrentStatus = async (req: Request, res: Response) => {
  try {
    const status = await powerService.getCurrentStatus();
    res.json(status);
  } catch (error) {
    logger.error('Get current status error:', error);
    res.status(500).json({ message: 'Error getting current power status' });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const { zoneId, limit } = req.query;
    const history = await powerService.getStatusHistory(
      zoneId ? parseInt(zoneId as string) : undefined,
      limit ? parseInt(limit as string) : 50
    );
    res.json(history);
  } catch (error) {
    logger.error('Get history error:', error);
    res.status(500).json({ message: 'Error getting status history' });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { campusZoneId, powerSource, status, notes } = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const newStatus = await powerService.updatePowerStatus({
      campusZoneId,
      powerSource,
      status,
      changedBy: userId,
      notes,
    });
    
    // Emit status change via Socket.io
    const io = req.app.get('io');
    io.emit('powerStatusChanged', newStatus);
    
    res.status(201).json(newStatus);
  } catch (error) {
    logger.error('Update status error:', error);
    res.status(500).json({ message: 'Error updating power status' });
  }
};

export const getZones = async (req: Request, res: Response) => {
  try {
    const zones = await powerService.getAllZones();
    res.json(zones);
  } catch (error) {
    logger.error('Get zones error:', error);
    res.status(500).json({ message: 'Error getting campus zones' });
  }
};

export const createZone = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const zone = await powerService.createZone(name, description);
    res.status(201).json(zone);
  } catch (error) {
    logger.error('Create zone error:', error);
    res.status(500).json({ message: 'Error creating campus zone' });
  }
};
