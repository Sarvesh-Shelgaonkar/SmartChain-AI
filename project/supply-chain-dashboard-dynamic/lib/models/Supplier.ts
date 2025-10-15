import mongoose from 'mongoose'

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  onTimeDelivery: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  avgDelay: {
    type: Number,
    default: 0,
  },
  qualityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  costEfficiency: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  sustainabilityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  contact: {
    email: String,
    phone: String,
    address: String,
  },
  performance: {
    lastMonth: Number,
    trend: String, // 'up', 'down', 'stable'
  },
}, {
  timestamps: true,
})

export default mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema)