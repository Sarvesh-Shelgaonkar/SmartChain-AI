import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'operator', 'viewer'],
    default: 'viewer',
  },
  department: {
    type: String,
    enum: ['inventory', 'logistics', 'procurement', 'operations', 'admin'],
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  permissions: [{
    type: String,
    enum: [
      'view_dashboard',
      'manage_inventory',
      'manage_deliveries',
      'manage_suppliers',
      'manage_orders',
      'view_analytics',
      'manage_users',
      'system_admin'
    ],
  }],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    language: {
      type: String,
      default: 'en',
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
}, {
  timestamps: true,
})

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Set default permissions based on role
UserSchema.pre('save', function(next) {
  if (!this.isModified('role')) return next()
  
  switch (this.role) {
    case 'admin':
      this.permissions = [
        'view_dashboard', 'manage_inventory', 'manage_deliveries',
        'manage_suppliers', 'manage_orders', 'view_analytics',
        'manage_users', 'system_admin'
      ]
      break
    case 'manager':
      this.permissions = [
        'view_dashboard', 'manage_inventory', 'manage_deliveries',
        'manage_suppliers', 'manage_orders', 'view_analytics'
      ]
      break
    case 'operator':
      this.permissions = [
        'view_dashboard', 'manage_inventory', 'manage_deliveries', 'manage_orders'
      ]
      break
    case 'viewer':
      this.permissions = ['view_dashboard']
      break
  }
  next()
})

export default mongoose.models.User || mongoose.model('User', UserSchema)