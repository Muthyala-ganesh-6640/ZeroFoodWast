import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema(
  {
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickupLocation: {
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    destinationLocation: {
      organizationName: { type: String },
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    pickupTime: { type: Date },
    deliveryTime: { type: Date },
    pickupProof: { type: String },
    distributionProof: { type: String },
    distributionLocation: { type: String },
    peopleServed: { type: Number },
    quantityDistributed: { type: Number },
    status: { type: String, enum: ['PICKUP_SCHEDULED', 'PICKED_UP', 'DELIVERED', 'DISTRIBUTED', 'COMPLETED'], default: 'PICKUP_SCHEDULED' },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Delivery', deliverySchema);
