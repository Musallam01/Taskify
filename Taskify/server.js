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
const Task = require('./models/Task');
const Reward = require('./models/Reward');

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Taskify API!');
});


// app.post('/register', async (req, res) => {
//   try {
//     const { username, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, password: hashedPassword, role });
//     await newUser.save();
//     res.status(201).send('User registered successfully');
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).send('Error registering user');
//   }
// });


// Login Route
app.post('/login', async (req, res) => {
  try {
    console.log('Received login request with data:', req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Missing username or password');
    }

    const user = await User.findOne({ username });

    console.log(user, 'User Response'); // Log the complete user object for verification

    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);

    // Send the complete user object along with token and role in the response
    res.json({ token, role: user.role, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error logging in user');
  }
});

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

// Create Task Route
app.post('/tasks', async (req, res) => {
  try {
    const {
      title,
      customerPhoneNumber,
      customerAddress,
      taskType,
      assignedUser,
      assignedBy,
      dueDate,
      description,
      requiredFees,
    } = req.body;

    const newTask = new Task({
      title,
      customerPhoneNumber,
      customerAddress,
      taskType,
      assignedUser,
      assignedBy,
      dueDate,
      description,
      requiredFees,
      creationDate: new Date(),
      status: 'remaining',
    });

    await newTask.save();
    res.status(201).send('Task created successfully');
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).send('Error creating task');
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Error fetching tasks');
  }
});

// Fetch Tasks for a Specific User Endpoint
app.get('/user/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ assignedUser: id });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).send('Error fetching user tasks');
  }
});

app.post('/api/tasks/:id/update-status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate task ID
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).send('Error fetching employees');
  }
});

app.get('/managers', async (req, res) => {
  try {
    const manager = await User.find({ role: 'manager' });
    res.json(manager);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).send('Error fetching managers');
  }
});

app.get('/unassigned-tasks', async (req, res) => {
  try {
    const unassignedTasks = await Task.find({ assignedUser: null });
    res.json(unassignedTasks);
  } catch (error) {
    console.error('Error fetching unassigned tasks:', error);
    res.status(500).send('Error fetching unassigned tasks');
  }
});

app.get('/active-employees', async (req, res) => {
  try {
    const activeEmployees = await User.find({ status: 'online', role: 'employee' });
    res.json(activeEmployees);
  } catch (error) {
    console.error('Error fetching active employees:', error);
    res.status(500).send('Error fetching active employees');
  }
});

// Tasks in Progress Route - Retrieve tasks with status 'in progress'
app.get('/tasks-in-progress', async (req, res) => {
  try {
    const tasksInProgress = await Task.find({ status: 'in progress' });
    res.json(tasksInProgress);
  } catch (error) {
    console.error('Error fetching tasks in progress:', error);
    res.status(500).send('Error fetching tasks in progress');
  }
});

// Fetch Finished Tasks for a Specific User Endpoint
app.get('/api/tasks/finished/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const finishedTasks = await Task.find({ assignedUser: userId, status: 'finished' });
    res.json(finishedTasks);
  } catch (error) {
    console.error('Error fetching finished tasks:', error);
    res.status(500).send('Error fetching finished tasks');
  }
});


// Fetch User Information Endpoint
app.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if user.tasks is not null or undefined before accessing length
    const tasksLeft = user.tasks ? user.tasks.length : 0;

    res.json({
      rating: user.rating,
      tasksLeft: tasksLeft,
      status: user.status,
    });
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).send('Error fetching user information');
  }
});

// Update User Status Endpoint
app.put('/user/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).send('Status not provided');
    }
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).send('Error updating user status');
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});