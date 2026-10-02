import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20);
    return res.json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch notifications.' });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    return res.json({ notification, message: 'Notification marked as read.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to update notification.' });
  }
};
