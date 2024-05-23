const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
}, { timestamps: true });

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;
