import { Router } from 'express';
import userRoutes from './userRoutes';
import powerRoutes from './powerRoutes';
import predictionRoutes from './predictionRoutes';
import analyticsRoutes from './analyticsRoutes';
import crowdsourceRoutes from './crowdsourceRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/power', powerRoutes);
router.use('/predictions', predictionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/crowdsource', crowdsourceRoutes);

export default router;
