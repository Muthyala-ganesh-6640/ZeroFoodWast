import express from 'express';
import multer from 'multer';
import {
  acceptDonation,
  createDonation,
  deliverDonation,
  distributeDonation,
  getDonationById,
  getDonations,
  markPickup,
} from '../controllers/donationController.js';
import { authorizeRoles, protect } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

router.use(protect);
router.get('/', getDonations);
router.post('/', upload.array('images', 5), createDonation);
router.get('/:id', getDonationById);
router.post('/:id/accept', authorizeRoles('PARTNER'), acceptDonation);
router.post('/:id/pickup', authorizeRoles('PARTNER'), markPickup);
router.post('/:id/deliver', authorizeRoles('PARTNER'), deliverDonation);
router.post('/:id/distribute', authorizeRoles('PARTNER'), distributeDonation);

export default router;
