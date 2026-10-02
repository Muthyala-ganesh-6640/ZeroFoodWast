import mongoose from 'mongoose';

const pickupLocationSchema = new mongoose.Schema(
  {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    pickupTime: { type: String },
  },
  { _id: false }
);

const donationSchema = new mongoose.Schema(
  {
    donationId: { type: String, required: true, unique: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    foodName: { type: String, required: true },
    category: { type: String, required: true },
    foodType: { type: String, enum: ['VEGETARIAN', 'NON_VEGETARIAN'], default: 'VEGETARIAN' },
    quantity: { type: Number, required: true },
    quantityUnit: { type: String, default: 'KG' },
    servings: { type: Number, required: true },
    preparedAt: { type: Date },
    expiryAt: { type: Date, required: true },
    sourceType: { type: String },
    description: { type: String },
    images: [{ type: String }],
    pickupLocation: pickupLocationSchema,
    status: {
      type: String,
      enum: [
        'AVAILABLE',
        'REQUESTED',
        'ACCEPTED',
        'PICKUP_SCHEDULED',
        'PICKED_UP',
        'IN_TRANSIT',
        'DELIVERED',
        'DISTRIBUTED',
        'COMPLETED',
        'CANCELLED',
        'EXPIRED',
      ],
      default: 'AVAILABLE',
    },
    deliveryNotes: { type: String },
    distributionProof: {
      imageUrl: { type: String },
      location: { type: String },
      lat: { type: Number },
      lng: { type: Number },
      date: { type: Date },
      quantityDistributed: { type: Number },
      peopleServed: { type: Number },
      organizationName: { type: String },
      notes: { type: String },
    },
    pickupProof: {
      imageUrl: { type: String },
      location: { type: String },
      lat: { type: Number },
      lng: { type: Number },
      timestamp: { type: Date },
      notes: { type: String },
    },
    destinationLocation: {
      organizationName: { type: String },
      organizationType: { type: String },
      contactPerson: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      lat: { type: Number },
      lng: { type: Number },
      peopleToServe: { type: Number },
      notes: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Donation', donationSchema);
