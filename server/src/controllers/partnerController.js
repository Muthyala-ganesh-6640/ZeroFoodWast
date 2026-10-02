import Partner from '../models/Partner.js';
import User from '../models/User.js';

export const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find().populate('userId', 'name email phone role status');
    return res.json({ partners });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch partners.' });
  }
};

export const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id).populate('userId', 'name email phone role status');
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found.' });
    }
    return res.json({ partner });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch partner details.' });
  }
};

export const updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found.' });
    }
    return res.json({ partner, message: 'Partner updated.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to update partner.' });
  }
};

export const verifyPartner = async (req, res) => {
  try {
    const { status } = req.body;
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found.' });
    }

    partner.verificationStatus = status;
    await partner.save();

    if (partner.userId) {
      const user = await User.findById(partner.userId);
      if (user) {
        user.status = status === 'VERIFIED' ? 'VERIFIED' : 'PENDING';
        await user.save();
      }
    }

    return res.json({ partner, message: 'Partner verification updated.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to verify partner.' });
  }
};
