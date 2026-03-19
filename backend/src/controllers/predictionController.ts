import { Request, Response } from 'express';
import { PredictionService } from '../services/predictionService';
import { logger } from '../utils/logger';

const predictionService = new PredictionService();

export const getPredictionsByZone = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    if (typeof zoneId !== 'string') {
      return res.status(400).json({ message: 'Invalid zone ID' });
    }
    const limitParam = req.query.limit;
    const limit = typeof limitParam === 'string' ? parseInt(limitParam) : 24;
    const predictions = await predictionService.getPredictions(
      parseInt(zoneId),
      limit
    );
    res.json(predictions);
  } catch (error) {
    logger.error('Get predictions error:', error);
    res.status(500).json({ message: 'Error getting predictions' });
  }
};

export const getAllPredictions = async (req: Request, res: Response) => {
  try {
    const predictions = await predictionService.getAllPredictions();
    res.json(predictions);
  } catch (error) {
    logger.error('Get all predictions error:', error);
    res.status(500).json({ message: 'Error getting all predictions' });
  }
};

export const generateMock = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    if (typeof zoneId !== 'string') {
      return res.status(400).json({ message: 'Invalid zone ID' });
    }
    const predictions = await predictionService.generateMockPredictions(parseInt(zoneId));
    res.json({ message: 'Mock predictions generated', predictions });
  } catch (error) {
    logger.error('Generate mock predictions error:', error);
    res.status(500).json({ message: 'Error generating mock predictions' });
  }
};
