import { Router } from 'express';
import { getZoneStats, getDailyUptime, getGlobalOutageStats } from '../controllers/analyticsController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.get('/zone/:zoneId', authenticate, getZoneStats);
router.get('/uptime/:zoneId', authenticate, getDailyUptime);
router.get('/outages', authenticate, authorize(['power_admin', 'super_admin']), getGlobalOutageStats);

export default router;
