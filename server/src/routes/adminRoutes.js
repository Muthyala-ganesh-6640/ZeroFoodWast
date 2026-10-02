import express from 'express';
import { getDashboard, getAnalytics, getDeliveries, getDonationsAdmin, getUsers } from '../controllers/adminController.js';
import { authorizeRoles, protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorizeRoles('ADMIN'));
router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/donations', getDonationsAdmin);
router.get('/deliveries', getDeliveries);
router.get('/analytics', getAnalytics);

export default router;
