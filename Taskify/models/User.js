const mongoose = require('mongoose');

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
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;