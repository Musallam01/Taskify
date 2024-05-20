const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskTitle: {
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
    enum: ['installation', 'fix'],
    required: true
  },
  chooseEmployee: {
    type: String,
    enum: ['specify later'],
    required: true
  },
  chooseDueDate: {
    type: Date,
    required: true
  },
  taskDescription: {
    type: String,
    required: true
  },
  requiredFees: {
    type: Number,
    required: true
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;