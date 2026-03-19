import { Router } from 'express';
import { getPredictionsByZone, getAllPredictions, generateMock } from '../controllers/predictionController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.get('/all', getAllPredictions);
router.get('/:zoneId', getPredictionsByZone);
router.post('/mock/:zoneId', authenticate, authorize(['super_admin']), generateMock);

export default router;
