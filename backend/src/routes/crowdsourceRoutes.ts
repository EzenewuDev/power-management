import { Router } from 'express';
import { reportOutage, getRecentReports } from '../controllers/crowdsourceController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/report', authenticate, reportOutage);
router.get('/recent/:zoneId', authenticate, getRecentReports);

export default router;
