import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['DONOR', 'PARTNER', 'ADMIN'], default: 'DONOR' },
    profileImage: { type: String },
    address: { type: String },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    status: { type: String, enum: ['PENDING', 'VERIFIED', 'ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

userSchema.index({ location: '2dsphere' });

export default mongoose.model('User', userSchema);
