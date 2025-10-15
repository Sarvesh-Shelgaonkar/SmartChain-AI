import mongoose from 'mongoose'

const DeliverySchema = new mongoose.Schema({
  truck: {
    type: String,
    required: true,
  },
  driver: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  eta: {
    type: String,
    required: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
  items: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['in-transit', 'delivered', 'delayed', 'cancelled'],
    default: 'in-transit',
  },
  startLocation: {
    type: String,
    required: true,
  },
  endLocation: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
}, {
  timestamps: true,
})

export default mongoose.models.Delivery || mongoose.model('Delivery', DeliverySchema)