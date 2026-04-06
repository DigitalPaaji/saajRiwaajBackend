const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  image:{
    type:String,

  },
  status:{
    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model('Tag', tagSchema);
