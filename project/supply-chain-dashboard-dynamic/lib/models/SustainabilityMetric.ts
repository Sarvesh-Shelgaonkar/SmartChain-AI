import mongoose from 'mongoose'

const SustainabilityMetricSchema = new mongoose.Schema({
  metric: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['carbon', 'waste', 'energy', 'water', 'packaging'],
    required: true,
  },
  trend: {
    type: String,
    enum: ['improving', 'declining', 'stable'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lastCalculated: {
    type: Date,
    default: Date.now,
  },
  monthlyData: [{
    month: String,
    value: Number,
  }],
}, {
  timestamps: true,
})

export default mongoose.models.SustainabilityMetric || mongoose.model('SustainabilityMetric', SustainabilityMetricSchema)