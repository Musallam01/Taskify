const mongoose = require('mongoose');

const ratingOptions = ['Bad', 'Decent', 'Good', 'Very Good', 'Excellent'];

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['manager', 'employee'],
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  status: {
    type: String,
    default: 'offline'
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ],
  rating: {
    type: String,
    enum: ratingOptions,
    default: 'Excellent',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;