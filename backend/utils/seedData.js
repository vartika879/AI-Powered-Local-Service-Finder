const mongoose = require('mongoose');
const Service = require('../models/Service');
require('dotenv').config({path: '../.env'});

const sampleServices = [
  // Restaurants
  { name: "Tunday Kababi", category: "restaurant", rating: 4.7, price: "₹500 for two", phone: "+91 522 4017781", address: "Chowk, Lucknow" },
  { name: "Royal Cafe", category: "restaurant", rating: 4.5, price: "₹300 for two", phone: "+91 94150 12345", address: "Hazratganj, Lucknow" },
  { name: "Dastarkhwan", category: "restaurant", rating: 4.6, price: "₹600 for two", phone: "+91 98390 98765", address: "Aliganj, Lucknow" },
  // Electricians
  { name: "QuickFix Electricals", category: "electrician", rating: 4.3, price: "₹400 call-out", phone: "+91 94555 11223", address: "Gomtinagar, Lucknow" },
  { name: "VoltSafe Services", category: "electrician", rating: 4.2, price: "₹350/hr", phone: "+91 99888 77665", address: "Indiranagar, Lucknow" },
  // Plumbers
  { name: "LeakGuard Plumbing", category: "plumber", rating: 4.4, price: "₹300 call", phone: "+91 93366 55444", address: "Charbagh, Lucknow" },
  { name: "AquaFix Solutions", category: "plumber", rating: 4.1, price: "₹350/hr", phone: "+91 95678 33221", address: "Hazratganj, Lucknow" },
  // Tutors
  { name: "BrainStorm Academy", category: "tutor", rating: 4.8, price: "₹2000/month", phone: "+91 80090 87654", address: "Alambagh, Lucknow" },
  { name: "HomeTutor Lucknow", category: "tutor", rating: 4.6, price: "₹1500/subject", phone: "+91 88777 99000", address: "Gomtinagar, Lucknow" },
  // Mechanics
  { name: "Sharma Motor Garage", category: "mechanic", rating: 4.3, price: "₹500 service", phone: "+91 94123 44556", address: "Chinhat, Lucknow" },
  { name: "SpeedCare Auto", category: "mechanic", rating: 4.4, price: "₹450 general check", phone: "+91 99888 66777", address: "Faizabad Road, Lucknow" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Service.deleteMany();
    await Service.insertMany(sampleServices);
    console.log("✅ Sample Lucknow services inserted!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();