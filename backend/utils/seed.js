// backend/utils/seed.js
// Run with: node backend/utils/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://HomeQuestAdmin:rohitHQ123@ac-iwvash4-shard-00-00.4ktifya.mongodb.net:27017,ac-iwvash4-shard-00-01.4ktifya.mongodb.net:27017,ac-iwvash4-shard-00-02.4ktifya.mongodb.net:27017/?ssl=true&replicaSet=atlas-6xh6vj-shard-0&authSource=admin&appName=Cluster3');
  console.log('✅ Connected to MongoDB');
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  const collections = ['users', 'agents', 'properties', 'bookings', 'inquiries', 'blogs', 'contactmessages'];
  for (const col of collections) {
    try { await mongoose.connection.collection(col).deleteMany({}); } catch {}
  }
  console.log('🧹 Cleared existing data');

  const User = require('../models/User');
  const Agent = require('../models/Agent');
  const Property = require('../models/Property');
  const Blog = require('../models/Blog');

  // Seed Admin
  const admin = await User.create({
    name: 'HomeQuest Admin',
    email: 'admin@homequest.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin'
  });
  console.log('👤 Admin user created');

  // Seed User
  const user = await User.create({
    name: 'Demo User',
    email: 'user@homequest.com',
    password: 'user123',
    phone: '9876543211',
    role: 'user'
  });
  console.log('👤 Demo user created');

  // Seed Agents
  const agents = await Agent.insertMany([
    {
      name: 'Ravi Kumar',
      email: 'ravi@homequest.in',
      phone: '9876500001',
      designation: 'Senior Property Consultant',
      bio: 'Mumbai-based luxury property specialist with 8+ years of experience.',
      experience: 8, city: 'Mumbai', propertiesSold: 185, rating: 4.9, totalReviews: 124,
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      specialization: ['Luxury Residential', 'Commercial', 'NRI Properties']
    },
    {
      name: 'Neha Patel',
      email: 'neha@homequest.in',
      phone: '9876500002',
      designation: 'Property Expert',
      bio: 'Bangalore tech corridor specialist helping IT professionals find their home.',
      experience: 6, city: 'Bangalore', propertiesSold: 142, rating: 4.8, totalReviews: 98,
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      specialization: ['Apartment', 'Tech Park Properties']
    },
    {
      name: 'Arjun Singh',
      email: 'arjun@homequest.in',
      phone: '9876500003',
      designation: 'Luxury Specialist',
      bio: 'Delhi NCR premier luxury property specialist for HNI clients.',
      experience: 10, city: 'Delhi', propertiesSold: 209, rating: 5.0, totalReviews: 167,
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      specialization: ['Luxury Villa', 'Premium Apartments']
    },
    {
      name: 'Meera Joshi',
      email: 'meera@homequest.in',
      phone: '9876500004',
      designation: 'Investment Advisor',
      bio: 'Pune investment property advisor specializing in plots and commercial.',
      experience: 7, city: 'Pune', propertiesSold: 163, rating: 4.9, totalReviews: 112,
      avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
      specialization: ['Plot', 'Investment', 'Commercial']
    }
  ]);
  console.log(`🤝 ${agents.length} agents created`);

  // Seed Properties
  const properties = await Property.insertMany([
    {
      title: 'Luxury 3BHK Apartment in Bandra West',
      description: 'Stunning 3BHK apartment with panoramic sea views, premium finishes, and world-class amenities. Located in the heart of Bandra West with excellent connectivity.',
      type: 'Apartment', listingType: 'Buy', price: 8500000, area: 1450,
      bedrooms: 3, bathrooms: 2, furnished: 'Semi-Furnished', parking: true,
      address: { street: '14, Linking Road', locality: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
      amenities: ['Gym', 'Swimming Pool', 'Power Backup', 'Security', 'Lift', 'Parking', 'Clubhouse'],
      agent: agents[0]._id, postedBy: admin._id, status: 'approved', isFeatured: true, isNew: true
    },
    {
      title: 'Modern Villa with Private Pool – DLF Phase 5',
      description: 'Breathtaking 4BHK villa with private pool, landscaped garden, and luxury interiors. Perfect for families seeking premium living in Gurgaon\'s most prestigious locality.',
      type: 'Villa', listingType: 'Buy', price: 25000000, area: 3200,
      bedrooms: 4, bathrooms: 3, furnished: 'Furnished', parking: true,
      address: { locality: 'DLF Phase 5', city: 'Gurgaon', state: 'Haryana', pincode: '122009' },
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
      amenities: ['Private Pool', 'Garden', 'Power Backup', 'Security', 'Gym', 'Clubhouse'],
      agent: agents[2]._id, postedBy: admin._id, status: 'approved', isFeatured: true, isNew: false
    },
    {
      title: 'Premium 2BHK Flat in Koramangala',
      description: 'Well-maintained 2BHK in Koramangala\'s prime zone, close to major tech parks. Perfect for IT professionals and young families.',
      type: 'Apartment', listingType: 'Rent', price: 35000, area: 980,
      bedrooms: 2, bathrooms: 2, furnished: 'Semi-Furnished', parking: true,
      address: { locality: 'Koramangala 4th Block', city: 'Bangalore', state: 'Karnataka', pincode: '560034' },
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
      amenities: ['Power Backup', 'Lift', 'Security', 'CCTV'],
      agent: agents[1]._id, postedBy: admin._id, status: 'approved', isFeatured: false, isNew: true
    },
    {
      title: 'Spacious Plot in Baner – Ready to Build',
      description: '1200 sqyd residential plot in Baner\'s upcoming IT corridor. RERA approved, clear title, and ready for immediate construction.',
      type: 'Plot', listingType: 'Buy', price: 7200000, area: 1080,
      bedrooms: 0, bathrooms: 0, furnished: 'Unfurnished', parking: false,
      address: { locality: 'Baner', city: 'Pune', state: 'Maharashtra', pincode: '411045' },
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
      amenities: ['RERA Approved', 'Road Facing', 'Corner Plot'],
      agent: agents[3]._id, postedBy: admin._id, status: 'approved', isFeatured: false, isNew: true
    },
    {
      title: 'Studio Apartment – Andheri West',
      description: 'Compact, fully furnished studio apartment ideal for working professionals. Walking distance from Andheri metro station.',
      type: 'Studio', listingType: 'Rent', price: 22000, area: 480,
      bedrooms: 1, bathrooms: 1, furnished: 'Furnished', parking: false,
      address: { locality: 'Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400058' },
      images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80'],
      amenities: ['WiFi Ready', 'Power Backup', 'Security'],
      agent: agents[0]._id, postedBy: admin._id, status: 'approved', isFeatured: false, isNew: false
    },
    {
      title: 'Commercial Office Space – Hitech City',
      description: 'Grade A commercial office space in Hyderabad\'s prime IT hub. Fully fitted with server room, conference rooms, and parking for 20 cars.',
      type: 'Commercial', listingType: 'Rent', price: 150000, area: 4500,
      bedrooms: 0, bathrooms: 4, furnished: 'Furnished', parking: true,
      address: { locality: 'Hitech City', city: 'Hyderabad', state: 'Telangana', pincode: '500081' },
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'],
      amenities: ['Power Backup', 'Lift', 'Security', 'Parking', 'Conference Room', 'Cafeteria'],
      agent: agents[1]._id, postedBy: admin._id, status: 'approved', isFeatured: true, isNew: false
    }
  ]);
  console.log(`🏠 ${properties.length} properties created`);

  // Seed Blog
  await Blog.insertMany([
    {
      title: '10 Things to Check Before Buying a Flat in 2024',
      slug: '10-things-check-buying-flat-2024',
      excerpt: 'Learn the essential checklist every home buyer must follow to avoid common pitfalls.',
      content: 'Full article content here...',
      category: 'Buying Guide',
      authorName: 'Priya Sharma',
      tags: ['buying', 'checklist', 'RERA', 'flat'],
      isPublished: true,
      views: 14280
    },
    {
      title: 'Best Cities to Invest in Real Estate in India 2024',
      slug: 'best-cities-invest-real-estate-india-2024',
      excerpt: 'A data-driven look at which Indian cities offer the best returns.',
      content: 'Full article content here...',
      category: 'Investment',
      authorName: 'Arjun Mehta',
      tags: ['investment', 'cities', 'returns'],
      isPublished: true,
      views: 9820
    }
  ]);
  console.log('📝 Blog posts created');

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('  👤 Admin: admin@homequest.com / admin123');
  console.log('  👤 User:  user@homequest.com / user123');
  console.log(`  🤝 Agents: ${agents.length}`);
  console.log(`  🏠 Properties: ${properties.length}`);
  console.log('\n🚀 Start the server: npm run dev');

  process.exit(0);
};

seedData().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
