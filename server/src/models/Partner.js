import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organizationName: { type: String, required: true },
    organizationType: { type: String, enum: ['NGO', 'Trust', 'Community Org', 'Food Bank', 'Other'], default: 'NGO' },
    phone: { type: String },
    address: { type: String },
    serviceAreas: [{ type: String }],
    documents: [{ type: String }],
    verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'], default: 'PENDING' },
  },
  { timestamps: true }
);

export default mongoose.model('Partner', partnerSchema);
