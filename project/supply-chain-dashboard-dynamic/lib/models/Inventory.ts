import mongoose from 'mongoose'

const InventorySchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  store: {
    type: String,
    required: true,
  },
  current: {
    type: Number,
    required: true,
  },
  optimal: {
    type: Number,
    required: true,
  },
  predicted: {
    type: Number,
    required: true,
  },
  trend: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    unique: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

export default mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema)