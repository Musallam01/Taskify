// Imports
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Load environment variables from .env file
dotenv.config();

// Express App Initialized
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies

// Connecting to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import User Model
const User = require('./models/User');
const Task = require('./models/Task'); // Import Task Model
const Reward = require('./models/Reward'); // Import Reward Model

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Taskify API!');
});

// Registration Route
app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Error registering user');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    console.log('Received login request with data:', req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Missing username or password');
    }

    const users = await User.find();
    console.log(users);

    const user = await User.findOne({ username });

    console.log(user, ' User Response');
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    console.log(token);
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error logging in user');
  }
});

// Create Reward Route
app.post('/rewards', async (req, res) => {
  try {
    const { amount, managerId, employeeId, taskId } = req.body;
    const reward = new Reward({ amount, manager: managerId, employee: employeeId, task: taskId });
    await reward.save();
    res.status(201).send('Reward created successfully');
  } catch (error) {
    console.error('Error creating reward:', error);
    res.status(500).send('Error creating reward');
  }
});

// Get Rewards Route
app.get('/rewards', async (req, res) => {
  try {
    const rewards = await Reward.find()
      .populate('manager')
      .populate('employee')
      .populate('task');
    res.json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).send('Error fetching rewards');
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});