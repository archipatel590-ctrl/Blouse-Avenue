import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: false,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  hoverImage: {
    type: String,
    required: false,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  fabric: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true,
    enum: ['New', 'Best Selling', 'Featured', 'Latest'],
    default: 'New'
  },
  category: {
    type: String,
    required: false
  },
  categories: {
    type: [String],
    default: []
  },
  showInWatchShop: {
    type: Boolean,
    default: false
  },
  showOnHomepage: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
