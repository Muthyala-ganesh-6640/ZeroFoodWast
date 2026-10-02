import Donation from '../models/Donation.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { emitToRole, emitToUser } from '../sockets/index.js';
import { uploadBufferToCloudinary } from '../services/uploadService.js';

const createDonationNotification = async (userId, title, message, type = 'DONATION') => {
  return Notification.create({ userId, title, message, type });
};

const serializeDonationForUser = (donation, user) => {
  const record = donation.toObject();
  const assignedPartnerId = record.partnerId?._id || record.partnerId;
  if (user.role === 'PARTNER' && String(assignedPartnerId) !== String(user.id)) {
    delete record.donorId.email;
    delete record.donorId.phone;
    delete record.donorId.address;
  }
  return record;
};

export const createDonation = async (req, res) => {
  try {
    const { foodName, category, foodType, quantity, quantityUnit, servings, preparedAt, expiryAt, sourceType, description, pickupLocation } = req.body;

    if (!foodName || !category || !quantity || !servings || !expiryAt) {
      return res.status(400).json({ message: 'Please complete all required donation fields.' });
    }

    const fileUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadBufferToCloudinary(file);
        if (url) fileUrls.push(url);
      }
    }

    const parsedExpiry = new Date(expiryAt);
    if (Number.isNaN(parsedExpiry.getTime())) {
      return res.status(400).json({ message: 'Expiry date is invalid.' });
    }

    const donation = await Donation.create({
      donationId: `ZFW-${Date.now()}`,
      donorId: req.user.id,
      foodName,
      category,
      foodType: foodType || 'VEGETARIAN',
      quantity: Number(quantity),
      quantityUnit: quantityUnit || 'KG',
      servings: Number(servings),
      preparedAt: preparedAt ? new Date(preparedAt) : new Date(),
      expiryAt: parsedExpiry,
      sourceType,
      description,
      images: fileUrls.length ? fileUrls : req.body.images || [],
      pickupLocation: pickupLocation || {},
      status: new Date() > parsedExpiry ? 'EXPIRED' : 'AVAILABLE',
    });

    await createDonationNotification(req.user.id, 'Donation posted', `${foodName} is now live for partner pickup.`, 'DONATION');
    emitToRole('ADMIN', 'new-donation', donation);
    emitToUser(req.user.id, 'donation-created', donation);

    return res.status(201).json({ donation, message: 'Donation submitted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to save donation.' });
  }
};

export const getDonations = async (req, res) => {
  try {
    const { status, donorId, partnerId } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (req.user.role === 'DONOR') {
      filters.donorId = req.user.id;
    } else if (req.user.role === 'PARTNER') {
      filters.$or = [
        { partnerId: req.user.id },
        { status: 'AVAILABLE' },
      ];
    } else {
      if (donorId) filters.donorId = donorId;
      if (partnerId) filters.partnerId = partnerId;
    }

    const donations = await Donation.find(filters)
      .sort({ createdAt: -1 })
      .populate('donorId', 'name phone address role')
      .populate('partnerId', 'name email phone role');

    return res.json({ donations: donations.map((donation) => serializeDonationForUser(donation, req.user)) });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch donations.' });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name phone address role')
      .populate('partnerId', 'name email phone role');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    return res.json({ donation: serializeDonationForUser(donation, req.user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch donation.' });
  }
};

export const acceptDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    if (donation.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'This donation is no longer available for acceptance.' });
    }

    if (new Date(donation.expiryAt) < new Date()) {
      donation.status = 'EXPIRED';
      await donation.save();
      return res.status(400).json({ message: 'This food donation has expired and is no longer available.' });
    }

    const partner = await User.findById(req.user.id);
    if (!partner || partner.role !== 'PARTNER') {
      return res.status(403).json({ message: 'Only verified partners can accept donations.' });
    }

    donation.partnerId = partner._id;
    donation.status = 'ACCEPTED';
    await donation.save();

    const donor = await User.findById(donation.donorId);
    await createDonationNotification(donor._id, 'Donation accepted', `${donation.foodName} accepted by ${partner.name}.`, 'DONATION');
    await createDonationNotification(partner._id, 'Pickup scheduled', `You have accepted ${donation.foodName}.`, 'PARTNER');
    await createDonationNotification(req.user.id, 'Donation accepted', 'You accepted the donation successfully.', 'PARTNER');

    emitToUser(donor._id, 'donation-accepted', donation);
    emitToRole('ADMIN', 'donation-accepted', donation);

    return res.json({ donation, message: 'Donation accepted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to accept donation.' });
  }
};

export const markPickup = async (req, res) => {
  try {
    const { pickupProof, pickupLocation, notes } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    if (!donation.partnerId || donation.partnerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'This donation is not assigned to your partner account.' });
    }

    if (donation.status !== 'ACCEPTED') {
      return res.status(400).json({ message: 'Only accepted donations can be marked as picked up.' });
    }

    donation.pickupProof = {
      imageUrl: pickupProof || '',
      location: pickupLocation || '',
      lat: req.body.lat,
      lng: req.body.lng,
      timestamp: new Date(),
      notes: notes || '',
    };
    donation.status = 'PICKED_UP';
    await donation.save();

    await createDonationNotification(donation.donorId, 'Food picked up', `${donation.foodName} has been picked up by the delivery partner.`, 'DONATION');
    emitToUser(donation.donorId, 'pickup-started', donation);

    return res.json({ donation, message: 'Pickup recorded successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to record pickup.' });
  }
};

export const deliverDonation = async (req, res) => {
  try {
    const { destinationLocation, notes } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    if (!donation.partnerId || donation.partnerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'This donation is not assigned to your partner account.' });
    }

    if (donation.status !== 'PICKED_UP') {
      return res.status(400).json({ message: 'Pick up the donation before marking it as delivered.' });
    }

    if (!destinationLocation?.organizationName?.trim() || !destinationLocation?.address?.trim() || !destinationLocation?.city?.trim()) {
      return res.status(400).json({ message: 'Provide the receiving organization or home name, address, and city.' });
    }

    donation.destinationLocation = {
      ...destinationLocation,
      organizationName: destinationLocation.organizationName.trim(),
      address: destinationLocation.address.trim(),
      city: destinationLocation.city.trim(),
    };
    donation.deliveryNotes = notes || '';
    donation.status = 'DELIVERED';
    await donation.save();

    await createDonationNotification(donation.donorId, 'Food delivered', `${donation.foodName} reached its destination.`, 'DONATION');
    emitToRole('ADMIN', 'delivery-completed', donation);

    return res.json({ donation, message: 'Delivery completed successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to complete delivery.' });
  }
};

export const distributeDonation = async (req, res) => {
  try {
    const { quantityDistributed, peopleServed, notes } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    if (!donation.partnerId || donation.partnerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'This donation is not assigned to your partner account.' });
    }

    if (donation.status !== 'DELIVERED') {
      return res.status(400).json({ message: 'Mark the donation as delivered before submitting distribution proof.' });
    }

    const destinationAddress = [donation.destinationLocation?.address, donation.destinationLocation?.city].filter(Boolean).join(', ');
    if (!donation.destinationLocation?.organizationName || !destinationAddress) {
      return res.status(400).json({ message: 'Set the receiving organization or home destination before submitting proof.' });
    }

    donation.distributionProof = {
      imageUrl: '',
      location: destinationAddress,
      lat: req.body.lat,
      lng: req.body.lng,
      date: new Date(),
      quantityDistributed: Number(quantityDistributed || donation.quantity),
      peopleServed: Number(peopleServed || donation.servings),
      organizationName: donation.destinationLocation.organizationName,
      notes: notes || '',
    };
    donation.status = 'COMPLETED';
    await donation.save();

    await createDonationNotification(donation.donorId, 'Food distributed', `${donation.foodName} was distributed to the community.`, 'DONATION');
    await createDonationNotification(req.user.id, 'Distribution verified', `${donation.foodName} distribution was verified successfully.`, 'PARTNER');
    emitToRole('ADMIN', 'distribution-completed', donation);

    return res.json({ donation, message: 'Distribution proof recorded successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to record distribution.' });
  }
};
