import express from 'express';
import { getPartnerById, getPartners, updatePartner, verifyPartner } from '../controllers/partnerController.js';
import { authorizeRoles, protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', authorizeRoles('ADMIN', 'PARTNER'), getPartners);
router.get('/:id', getPartnerById);
router.put('/:id', authorizeRoles('ADMIN', 'PARTNER'), updatePartner);
router.post('/:id/verify', authorizeRoles('ADMIN'), verifyPartner);

export default router;
