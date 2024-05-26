const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  customerPhoneNumber: {
    type: Number,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  taskType: {
    type: String,
    enum: ['Installation', 'Fix'],
    required: true
  },
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  requiredFees: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['in progress', 'finished', 'remaining'],
    default: 'remaining'
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;