// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  image:{
     type: String,
  }
});

module.exports = mongoose.model('Category', categorySchema);
