import Donation from '../models/Donation.js';
import User from '../models/User.js';
import Partner from '../models/Partner.js';

export const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalDonations, todaysDonations, monthlyDonations, totalFoodRescued, totalMealsServed, activeDeliveries, completedDeliveries, activeDonors, verifiedPartners, expiredDonations] = await Promise.all([
      Donation.countDocuments(),
      Donation.countDocuments({ createdAt: { $gte: today } }),
      Donation.countDocuments({ createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) } }),
      Donation.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]),
      Donation.aggregate([{ $group: { _id: null, total: { $sum: '$servings' } } }]),
      Donation.countDocuments({ status: { $in: ['ACCEPTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'] } }),
      Donation.countDocuments({ status: 'COMPLETED' }),
      User.countDocuments({ role: 'DONOR' }),
      Partner.countDocuments({ verificationStatus: 'VERIFIED' }),
      Donation.countDocuments({ status: 'EXPIRED' }),
    ]);

    return res.json({
      totalDonations,
      todaysDonations,
      monthlyDonations,
      totalFoodRescued: totalFoodRescued[0]?.total || 0,
      totalMealsServed: totalMealsServed[0]?.total || 0,
      activeDeliveries,
      completedDeliveries,
      activeDonors,
      verifiedPartners,
      expiredDonations,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch dashboard metrics.' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch users.' });
  }
};

export const getDonationsAdmin = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 }).populate('donorId', 'name email').populate('partnerId', 'name email');
    return res.json({ donations });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch donation records.' });
  }
};

export const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Donation.find({ status: { $in: ['ACCEPTED', 'PICKED_UP', 'DELIVERED', 'COMPLETED'] } }).sort({ createdAt: -1 });
    return res.json({ deliveries });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch delivery records.' });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const donations = await Donation.find({ createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) } }).sort({ createdAt: 1 });

    const dailyDonations = donations.reduce((acc, item) => {
      const key = new Date(item.createdAt).toISOString().slice(0, 10);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const monthlyDonations = donations.reduce((acc, item) => {
      const key = new Date(item.createdAt).toISOString().slice(0, 7);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const categoryBreakdown = donations.reduce((acc, item) => {
      const key = item.category || 'Other';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const statusBreakdown = donations.reduce((acc, item) => {
      const key = item.status || 'UNKNOWN';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const sourceBreakdown = donations.reduce((acc, item) => {
      const key = item.sourceType || 'Other';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const foodRescued = donations.reduce((acc, item) => {
      const key = new Date(item.createdAt).toISOString().slice(0, 7);
      acc[key] = (acc[key] || 0) + Number(item.quantity || 0);
      return acc;
    }, {});

    const mealsServed = donations.reduce((acc, item) => {
      const key = new Date(item.createdAt).toISOString().slice(0, 7);
      acc[key] = (acc[key] || 0) + Number(item.servings || 0);
      return acc;
    }, {});

    return res.json({
      dailyDonations: Object.entries(dailyDonations).map(([name, value]) => ({ name, value })),
      monthlyDonations: Object.entries(monthlyDonations).map(([name, value]) => ({ name, value })),
      categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
      statusBreakdown: Object.entries(statusBreakdown).map(([name, value]) => ({ name, value })),
      sourceBreakdown: Object.entries(sourceBreakdown).map(([name, value]) => ({ name, value })),
      foodRescued: Object.entries(foodRescued).map(([name, value]) => ({ name, value })),
      mealsServed: Object.entries(mealsServed).map(([name, value]) => ({ name, value })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to compute analytics.' });
  }
};
