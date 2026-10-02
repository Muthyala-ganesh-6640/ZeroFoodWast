import jwt from 'jsonwebtoken';

export const generateToken = (user) => jwt.sign(
  {
    id: user._id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET || 'zerofoodwaste-secret',
  { expiresIn: '7d' }
);
