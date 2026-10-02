import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { generateToken } from '../utils/jwt.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  profileImage: user.profileImage,
  address: user.address,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'DONOR' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password.' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role,
      status: role === 'PARTNER' ? 'PENDING' : 'ACTIVE',
    });

    const token = generateToken(user);

    await Notification.create({
      userId: user._id,
      title: 'Welcome to ZeroFoodWaste',
      message: `Welcome ${user.name}! Your account is ready.`,
      type: 'ACCOUNT',
    });

    return res.status(201).json({
      token,
      user: sanitizeUser(user),
      message: 'Registration successful.',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to register user.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: sanitizeUser(user),
      message: 'Login successful.',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to log in.' });
  }
};

export const logout = async (req, res) => {
  return res.json({ message: 'Logged out successfully.' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  return res.json({ message: `Password reset instructions sent to ${email}.` });
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'New password is required.' });
  }

  return res.json({ message: 'Password updated successfully.' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch user profile.' });
  }
};
