const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['restaurant', 'electrician', 'plumber', 'tutor', 'mechanic'] },
  rating: { type: Number, default: 4.0, min: 1, max: 5 },
  price: { type: String },       // e.g., "₹500 for two" or "₹800/hr"
  phone: { type: String },
  address: { type: String },
  city: { type: String, default: 'Lucknow' }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);