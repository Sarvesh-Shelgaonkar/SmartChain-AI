import dbConnect from '../lib/mongodb'
import User from '../lib/models/User'
import Inventory from '../lib/models/Inventory'
import Delivery from '../lib/models/Delivery'
import Supplier from '../lib/models/Supplier'
import ReorderRecommendation from '../lib/models/ReorderRecommendation'
import SustainabilityMetric from '../lib/models/SustainabilityMetric'
import dummyData from '../data/dummy-data.json'

const inventoryData = [
  {
    product: "Parachute Coconut Oil",
    store: "Jalgaon Central",
    current: 45,
    optimal: 100,
    predicted: 15,
    trend: -12,
    category: "Personal Care",
    sku: "PCO-500ML",
  },
  {
    product: "Maggi Noodles 2-Min",
    store: "Nashik Mall",
    current: 234,
    optimal: 200,
    predicted: 180,
    trend: 8,
    category: "Food",
    sku: "MAG-2MIN",
  },
  {
    product: "Tata Salt",
    store: "Aurangabad Plaza",
    current: 89,
    optimal: 150,
    predicted: 120,
    trend: -5,
    category: "Grocery",
    sku: "TTS-1KG",
  },
  {
    product: "Surf Excel",
    store: "Kolhapur Store",
    current: 23,
    optimal: 80,
    predicted: 8,
    trend: -18,
    category: "Household",
    sku: "SFX-1KG",
  },
  {
    product: "Britannia Biscuits",
    store: "Solapur Branch",
    current: 156,
    optimal: 120,
    predicted: 200,
    trend: 15,
    category: "Food",
    sku: "BRT-100G",
  },
]

const deliveryData = [
  {
    truck: "MH-12-AB-1234",
    driver: "Rajesh Kumar",
    route: "Mumbai → Jalgaon",
    progress: 75,
    eta: "2h 15m",
    delay: 0,
    items: 45,
    status: "in-transit",
    startLocation: "Mumbai",
    endLocation: "Jalgaon",
    coordinates: { lat: 20.0504, lng: 75.5648 },
  },
  {
    truck: "MH-14-CD-5678",
    driver: "Priya Sharma",
    route: "Pune → Nashik",
    progress: 45,
    eta: "3h 45m",
    delay: 30,
    items: 67,
    status: "in-transit",
    startLocation: "Pune",
    endLocation: "Nashik",
    coordinates: { lat: 19.9975, lng: 73.7898 },
  },
  {
    truck: "MH-16-EF-9012",
    driver: "Amit Patel",
    route: "Nagpur → Aurangabad",
    progress: 90,
    eta: "45m",
    delay: -15,
    items: 32,
    status: "in-transit",
    startLocation: "Nagpur",
    endLocation: "Aurangabad",
    coordinates: { lat: 19.8762, lng: 75.3433 },
  },
  {
    truck: "MH-18-GH-3456",
    driver: "Sunita Yadav",
    route: "Mumbai → Kolhapur",
    progress: 25,
    eta: "5h 30m",
    delay: 45,
    items: 78,
    status: "delayed",
    startLocation: "Mumbai",
    endLocation: "Kolhapur",
    coordinates: { lat: 16.7050, lng: 74.2433 },
  },
]

const supplierData = [
  {
    name: "Hindustan Unilever Ltd",
    category: "FMCG",
    onTimeDelivery: 94.2,
    avgDelay: 2.3,
    qualityScore: 96.8,
    costEfficiency: 89.5,
    sustainabilityScore: 92.1,
    totalOrders: 1247,
    rating: 4.8,
    contact: {
      email: "orders@hul.com",
      phone: "+91-22-6678-1234",
      address: "Mumbai, Maharashtra",
    },
    performance: {
      lastMonth: 94.2,
      trend: "up",
    },
  },
  {
    name: "Nestle India Ltd",
    category: "Food & Beverages",
    onTimeDelivery: 91.7,
    avgDelay: 3.1,
    qualityScore: 95.2,
    costEfficiency: 87.3,
    sustainabilityScore: 88.9,
    totalOrders: 892,
    rating: 4.6,
    contact: {
      email: "supply@nestle.in",
      phone: "+91-124-3985-000",
      address: "Gurgaon, Haryana",
    },
    performance: {
      lastMonth: 91.7,
      trend: "stable",
    },
  },
  {
    name: "Tata Consumer Products",
    category: "FMCG",
    onTimeDelivery: 88.9,
    avgDelay: 4.2,
    qualityScore: 93.7,
    costEfficiency: 91.2,
    sustainabilityScore: 95.4,
    totalOrders: 634,
    rating: 4.4,
    contact: {
      email: "procurement@tatacp.com",
      phone: "+91-22-6665-8282",
      address: "Mumbai, Maharashtra",
    },
    performance: {
      lastMonth: 88.9,
      trend: "down",
    },
  },
]

const reorderData = [
  {
    sku: "PCO-500ML",
    product: "Parachute Coconut Oil 500ml",
    store: "Jalgaon Central",
    currentStock: 23,
    dailyConsumption: 8.5,
    daysLeft: 2.7,
    recommendedOrder: 150,
    priority: "urgent",
    supplier: "Hindustan Unilever Ltd",
    estimatedCost: 12750,
    leadTime: 3,
    category: "Personal Care",
    reason: "Stock critically low, high demand expected",
  },
  {
    sku: "SFX-1KG",
    product: "Surf Excel 1kg",
    store: "Kolhapur Store",
    currentStock: 12,
    dailyConsumption: 6.2,
    daysLeft: 1.9,
    recommendedOrder: 100,
    priority: "urgent",
    supplier: "Hindustan Unilever Ltd",
    estimatedCost: 8500,
    leadTime: 2,
    category: "Household",
    reason: "Emergency restock needed",
  },
]

const sustainabilityData = [
  {
    metric: "Carbon Footprint",
    value: 2847,
    unit: "tons CO2",
    target: 2500,
    category: "carbon",
    trend: "declining",
    description: "Total carbon emissions from supply chain operations",
    monthlyData: [
      { month: "Jan", value: 2950 },
      { month: "Feb", value: 2890 },
      { month: "Mar", value: 2847 },
    ],
  },
  {
    metric: "Waste Reduction",
    value: 78.5,
    unit: "% recycled",
    target: 85,
    category: "waste",
    trend: "improving",
    description: "Percentage of waste materials recycled",
    monthlyData: [
      { month: "Jan", value: 75.2 },
      { month: "Feb", value: 76.8 },
      { month: "Mar", value: 78.5 },
    ],
  },
  {
    metric: "Energy Efficiency",
    value: 92.3,
    unit: "% renewable",
    target: 95,
    category: "energy",
    trend: "improving",
    description: "Percentage of renewable energy usage",
    monthlyData: [
      { month: "Jan", value: 89.1 },
      { month: "Feb", value: 90.7 },
      { month: "Mar", value: 92.3 },
    ],
  },
]

async function seedDatabase() {
  try {
    await dbConnect()
    
    console.log('Starting database seeding...')
    
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Inventory.deleteMany({}),
      Delivery.deleteMany({}),
      Supplier.deleteMany({}),
      ReorderRecommendation.deleteMany({}),
      SustainabilityMetric.deleteMany({}),
    ])
    
    console.log('Cleared existing data')
    
    // Seed new data from JSON file
    await Promise.all([
      User.insertMany(dummyData.users),
      Inventory.insertMany(dummyData.inventory),
      Delivery.insertMany(dummyData.deliveries),
      Supplier.insertMany(dummyData.suppliers),
      ReorderRecommendation.insertMany(dummyData.reorderRecommendations),
      SustainabilityMetric.insertMany(dummyData.sustainabilityMetrics),
    ])
    
    console.log('Database seeded successfully!')
    console.log(`Seeded:`)
    console.log(`- ${dummyData.users.length} users`)
    console.log(`- ${dummyData.inventory.length} inventory items`)
    console.log(`- ${dummyData.deliveries.length} deliveries`)
    console.log(`- ${dummyData.suppliers.length} suppliers`)
    console.log(`- ${dummyData.reorderRecommendations.length} reorder recommendations`)
    console.log(`- ${dummyData.sustainabilityMetrics.length} sustainability metrics`)
    
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

export default seedDatabase