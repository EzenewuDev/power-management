import { Router } from 'express';
import { getCurrentStatus, getHistory, updateStatus, getZones, createZone } from '../controllers/powerController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.get('/status', getCurrentStatus);
router.get('/history', getHistory);
router.get('/zones', getZones);
router.post('/zones', authenticate, authorize(['super_admin']), createZone);
router.post('/status', authenticate, authorize(['power_admin', 'super_admin']), updateStatus);

export default router;
