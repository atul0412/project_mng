const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['CLIENT', 'ADMIN'],
    default: 'CLIENT',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Client', clientSchema);
