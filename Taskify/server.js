// Imports
const express = require('express');
const mongoose = require('mongoose');

// Express App Initiliazed
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/taskifydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Taskify API!');
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});