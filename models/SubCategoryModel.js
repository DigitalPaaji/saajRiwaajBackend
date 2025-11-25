// models/SubCategory.js
const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    trim: true,
    lowercase: true
  },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true, 
    },
});
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });
module.exports = mongoose.model('SubCategory', subCategorySchema);
