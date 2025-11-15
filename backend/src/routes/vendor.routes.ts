import { Router } from 'express';
import { getVendorDashboard } from '../controllers/vendor.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', authenticate, authorize('VENDOR', 'ADMIN'), getVendorDashboard);

export default router;