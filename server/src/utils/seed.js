import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Donation from '../models/Donation.js';
import Partner from '../models/Partner.js';
import Notification from '../models/Notification.js';

export const seedDemoData = async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    return;
  }

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const donorPassword = await bcrypt.hash('Donor123!', 10);
  const partnerPassword = await bcrypt.hash('Partner123!', 10);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@zerofoodwaste.com',
    password: adminPassword,
    phone: '+91 90000 00001',
    role: 'ADMIN',
    status: 'ACTIVE',
    address: 'ZeroFoodWaste HQ, Hyderabad',
  });

  const donor = await User.create({
    name: 'Priya Sharma',
    email: 'donor@zerofoodwaste.com',
    password: donorPassword,
    phone: '+91 90000 00002',
    role: 'DONOR',
    status: 'ACTIVE',
    address: 'Banjara Hills, Hyderabad',
  });

  const partnerUser = await User.create({
    name: 'Green Hope Team',
    email: 'partner@zerofoodwaste.com',
    password: partnerPassword,
    phone: '+91 90000 00003',
    role: 'PARTNER',
    status: 'ACTIVE',
    address: 'Madhapur, Hyderabad',
  });

  const partner = await Partner.create({
    userId: partnerUser._id,
    organizationName: 'Green Hope NGO',
    organizationType: 'NGO',
    phone: '+91 90000 00003',
    address: 'Madhapur, Hyderabad',
    serviceAreas: ['Banjara Hills', 'Madhapur', 'Gachibowli'],
    verificationStatus: 'VERIFIED',
    documents: ['https://example.com/doc-1.pdf'],
  });

  const donationOne = await Donation.create({
    donationId: 'ZFW-1001',
    donorId: donor._id,
    foodName: 'Rice & Curry',
    category: 'Meals',
    foodType: 'VEGETARIAN',
    quantity: 25,
    quantityUnit: 'KG',
    servings: 100,
    preparedAt: new Date(),
    expiryAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    sourceType: 'WEDDING',
    description: 'Fresh vegetarian meal package from a wedding event.',
    images: ['https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80'],
    pickupLocation: {
      address: 'Banjara Hills Road No 12',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      lat: 17.4151,
      lng: 78.4505,
      pickupTime: '18:30',
    },
    status: 'ACCEPTED',
    partnerId: partnerUser._id,
  });

  await Donation.create({
    donationId: 'ZFW-1002',
    donorId: donor._id,
    foodName: 'Fruit Baskets',
    category: 'Fresh Food',
    foodType: 'VEGETARIAN',
    quantity: 12,
    quantityUnit: 'KG',
    servings: 40,
    preparedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiryAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    sourceType: 'PARTY',
    description: 'Assorted fruit baskets from a community event.',
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80'],
    pickupLocation: {
      address: 'Hitech City, near Gachibowli',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      lat: 17.4401,
      lng: 78.3762,
      pickupTime: '19:00',
    },
    status: 'AVAILABLE',
  });

  await Donation.create({
    donationId: 'ZFW-1003',
    donorId: donor._id,
    foodName: 'Bakery Pack',
    category: 'Snacks',
    foodType: 'VEGETARIAN',
    quantity: 8,
    quantityUnit: 'KG',
    servings: 30,
    preparedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    expiryAt: new Date(Date.now() - 30 * 60 * 1000),
    sourceType: 'RESTAURANT',
    description: 'Fresh bakery snacks from restaurant inventory.',
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80'],
    pickupLocation: {
      address: 'Madhapur Main Road',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      lat: 17.4399,
      lng: 78.3911,
      pickupTime: '20:30',
    },
    status: 'EXPIRED',
  });

  await Notification.insertMany([
    {
      userId: donor._id,
      title: 'Donation posted',
      message: 'Your donation has been listed and is visible to verified partners.',
      type: 'DONATION',
      isRead: false,
    },
    {
      userId: partnerUser._id,
      title: 'New donation available',
      message: 'A new donation is ready for pickup near Banjara Hills.',
      type: 'PARTNER',
      isRead: false,
    },
    {
      userId: admin._id,
      title: 'New donation',
      message: 'A fresh donation was posted and is awaiting partner action.',
      type: 'ADMIN',
      isRead: false,
    },
  ]);

  console.log('Demo users, partner, donations, and notifications seeded');
};
