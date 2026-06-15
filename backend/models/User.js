import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  phone: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  favorites: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
