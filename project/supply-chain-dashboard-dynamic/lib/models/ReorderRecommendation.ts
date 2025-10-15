import mongoose from 'mongoose'

const ReorderRecommendationSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  store: {
    type: String,
    required: true,
  },
  currentStock: {
    type: Number,
    required: true,
  },
  dailyConsumption: {
    type: Number,
    required: true,
  },
  daysLeft: {
    type: Number,
    required: true,
  },
  recommendedOrder: {
    type: Number,
    required: true,
  },
  priority: {
    type: String,
    enum: ['urgent', 'high', 'medium', 'low'],
    required: true,
  },
  supplier: {
    type: String,
    required: true,
  },
  estimatedCost: {
    type: Number,
    required: true,
  },
  leadTime: {
    type: Number, // in days
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  isProcessed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

export default mongoose.models.ReorderRecommendation || mongoose.model('ReorderRecommendation', ReorderRecommendationSchema)