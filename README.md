# SmartChain-AI
Developed SmartChain AI, a full-stack Supply Chain Management dashboard using Next.js, MongoDB, and JWT authentication, with granular role-based access for Admins, Managers, and Operators and Implemented inventory management with planned AI-powered reorder recommendations, laying the foundation for intelligent stock optimization and Built delivery tracking and supplier performance modules with a structured workflow, designed for future integration of real-time updates and Designed an analytics-driven UI with Recharts, providing dashboards, reporting tools, and performance insights for supply chain operations.



## Overview
### 1. Authentication System
- **User Registration & Login** with secure password hashing
- **JWT-based Authentication** with HTTP-only cookies
- **Role-based Permissions** (Admin, Manager, Operator, Viewer)
- **Protected Routes** with permission checking
- **User Profile Management** with preferences

### 2. Database Models
- **Users** - Authentication and role management
- **Inventory** - Stock management with predictions
- **Deliveries** - Real-time tracking with coordinates
- **Suppliers** - Performance metrics and ratings
- **Reorder Recommendations** - AI-powered suggestions
- **Sustainability Metrics** - Environmental tracking

### 3. New Pages & Features
- **Login/Register Pages** - Beautiful authentication forms
- **Dashboard** - Enhanced with user info and role-based navigation
- **Analytics Page** - Revenue, performance, and trend analysis
- **Reports Page** - Document generation and management
- **Settings Page** - User preferences and security settings
- **User Management** - Admin-only user administration
- **All existing pages** enhanced with authentication

### 4. API Endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/users` - User management
- `/api/inventory` - Inventory CRUD operations
- `/api/deliveries` - Delivery tracking
- `/api/suppliers` - Supplier management
- `/api/reorder-recommendations` - Reorder suggestions
- `/api/sustainability` - Environmental metrics
- `/api/seed` - Database seeding

## Setup Instructions

### 1. Install Dependencies
```bash
cd supply-chain-dashboard-dynamic
npm install
```

### 2. Set Up MongoDB
Choose one option:

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Keep default connection string in `.env.local`

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Get connection string
4. Update `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/supply-chain-dashboard?retryWrites=true&w=majority
```

### 3. Environment Variables
Update `.env.local` with your settings:
```
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App URL
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### 4. Seed Database with Sample Data
```bash
npm run dev
```

Then seed the database (choose one method):

#### Method A: Using Browser
Visit: `http://localhost:3000/api/seed` (POST request)

#### Method B: Using curl
```bash
curl -X POST http://localhost:3000/api/seed
```

#### Method C: Using Postman
- URL: `http://localhost:3000/api/seed`
- Method: POST
- Send request

### 5. Access the Application
Visit `http://localhost:3000`

## Demo Accounts

After seeding, you can login with these demo accounts:

### Admin Account
- **Email:** admin@smartchain.com
- **Password:** admin123
- **Permissions:** Full system access

### Manager Account
- **Email:** manager@smartchain.com
- **Password:** manager123
- **Permissions:** Inventory, deliveries, suppliers, analytics

### Operator Account
- **Email:** operator@smartchain.com
- **Password:** operator123
- **Permissions:** Inventory and delivery management

## Features by Role

### Admin (Full Access)
- Dashboard overview
- Inventory management
- Delivery tracking
- Supplier performance
- Reorder recommendations
- Analytics & reports
- User management
- System settings

### Manager
- Dashboard overview
- Inventory management
- Delivery tracking
- Supplier performance
- Reorder recommendations
- Analytics & reports
- Personal settings

### Operator
- Dashboard overview
- Inventory management
- Delivery tracking
- Reorder processing
- Personal settings

### Viewer
- Dashboard overview (read-only)
- Personal settings

## Page Structure

```
/                     # Auto-redirect based on auth status
/login               # Login page
/register            # Registration page
/dashboard           # Main dashboard (protected)
/inventory           # Inventory management (protected)
/deliveries          # Delivery tracking (protected)
/suppliers           # Supplier performance (protected)
/reorder             # Reorder recommendations (protected)
/analytics           # Analytics & insights (manager+ only)
/reports             # Reports & documents (manager+ only)
/settings            # User settings (protected)
/users               # User management (admin only)
```

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'manager' | 'operator' | 'viewer',
  department: String,
  isActive: Boolean,
  permissions: [String],
  preferences: {
    theme: String,
    language: String,
    notifications: Object
  }
}
```

### Inventory Collection
```javascript
{
  product: String,
  store: String,
  current: Number,
  optimal: Number,
  predicted: Number,
  trend: Number,
  category: String,
  sku: String
}
```

### Deliveries Collection
```javascript
{
  truck: String,
  driver: String,
  route: String,
  progress: Number,
  eta: String,
  delay: Number,
  items: Number,
  status: String,
  coordinates: Object
}
```

## API Usage Examples

### Authentication
```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})

// Get current user
const user = await fetch('/api/auth/me')

// Logout
await fetch('/api/auth/logout', { method: 'POST' })
```

### Data Operations
```javascript
// Get inventory
const inventory = await fetch('/api/inventory')

// Update inventory item
await fetch('/api/inventory', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ _id, ...updateData })
})
```

## Customization Guide

### 1. Adding New Roles
1. Update User model in `lib/models/User.ts`
2. Add permissions in the pre-save hook
3. Update permission checks in components

### 2. Adding New Pages
1. Create page in `app/your-page/page.tsx`
2. Wrap with `<ProtectedRoute>`
3. Add navigation link in dashboard
4. Create API routes if needed

### 3. Modifying Data Models
1. Update model in `lib/models/`
2. Update API routes
3. Update dummy data in `data/dummy-data.json`
4. Re-seed database

### 4. Customizing UI
1. Modify components in `components/`
2. Update Tailwind classes
3. Add new UI components as needed

## Production Deployment

### 1. Environment Setup
```bash
# Production environment variables
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_production_secret
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com
```

### 2. Security Checklist
- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Set up proper CORS
- [ ] Configure rate limiting
- [ ] Set up monitoring

### 3. Deployment Options
- **Vercel** (Recommended for Next.js)
- **AWS** (EC2 + RDS/DocumentDB)
- **Google Cloud Platform**
- **Azure**
- **DigitalOcean**

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check connection string format
   - Verify network access (Atlas IP whitelist)
   - Ensure MongoDB service is running

2. **Authentication Not Working**
   - Check JWT_SECRET is set
   - Verify cookie settings
   - Clear browser cookies

3. **Permission Denied Errors**
   - Check user role and permissions
   - Verify ProtectedRoute implementation
   - Re-seed database if needed

4. **API Errors**
   - Check browser console
   - Verify API endpoint URLs
   - Check request/response format

### Getting Help
- Check browser console for errors
- Review server logs
- Verify environment variables
- Test API endpoints directly

## Next Steps

1. **Customize Data**: Replace dummy data with your actual business data
2. **Add Features**: Implement additional functionality as needed
3. **Enhance Security**: Add 2FA, audit logs, etc.
4. **Optimize Performance**: Add caching, pagination, etc.
5. **Deploy**: Choose hosting platform and deploy to production

## File Structure

```
supply-chain-dashboard-dynamic/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── inventory/            # Inventory CRUD
│   │   ├── deliveries/           # Delivery management
│   │   ├── suppliers/            # Supplier management
│   │   ├── reorder-recommendations/ # Reorder API
│   │   ├── sustainability/       # Sustainability metrics
│   │   ├── users/               # User management
│   │   └── seed/                # Database seeding
│   ├── dashboard/               # Main dashboard page
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── inventory/               # Inventory management page
│   ├── deliveries/              # Delivery tracking page
│   ├── suppliers/               # Supplier performance page
│   ├── reorder/                 # Reorder recommendations page
│   ├── analytics/               # Analytics page
│   ├── reports/                 # Reports page
│   ├── settings/                # Settings page
│   ├── users/                   # User management page
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page with auth redirect
├── components/                   # React components
│   ├── ui/                      # Shadcn UI components
│   ├── protected-route.tsx      # Route protection component
│   └── [other components]       # Feature components
├── hooks/                       # Custom React hooks
│   ├── useInventory.ts          # Inventory data hook
│   ├── useDeliveries.ts         # Delivery data hook
│   ├── useSuppliers.ts          # Supplier data hook
│   └── useReorderRecommendations.ts # Reorder hook
├── lib/                         # Utilities and configurations
│   ├── models/                  # Database models
│   │   ├── User.ts              # User model with auth
│   │   ├── Inventory.ts         # Inventory model
│   │   ├── Delivery.ts          # Delivery model
│   │   ├── Supplier.ts          # Supplier model
│   │   ├── ReorderRecommendation.ts # Reorder model
│   │   └── SustainabilityMetric.ts # Sustainability model
│   ├── auth-context.tsx         # Authentication context
│   ├── mongodb.ts               # Database connection
│   └── utils.ts                 # Utility functions
├── data/                        # Sample data
│   └── dummy-data.json          # Comprehensive dummy data
├── scripts/                     # Database scripts
│   └── seed-database.ts         # Database seeding script
├── .env.local                   # Environment variables
├── package.json                 # Dependencies and scripts
└── [config files]              # Next.js, Tailwind, TypeScript configs
```
