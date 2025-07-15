const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loginSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

// ✅ Sign Up Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.json({ message: 'User already exists' });

  await User.create({ username, password });
  res.json({ message: 'User registered successfully' });
});

// ✅ Login Route
app.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  const user = await User.findOne({ username, password, role });

  if (user) {
    res.json({ message: `Welcome, ${role} ${username}` });
  } else {
    res.json({ message: 'Invalid credentials or role' });
  }
});

// ✅ Start Server
app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
});
