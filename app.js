import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { exec } from 'child_process';

const MONGO_URI = 'mongodb+srv://mani:mani9896@cluster0.j8c6a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  fullName: String,
  phone: String,
  dob: String,
  gender: String,
  location: String,
  twoFactorAuth: Boolean,
  score: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

// Run Code API
app.post('/runCode', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).send('Code is required.');

    exec(`node -e "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
      if (error || stderr) {
        return res.status(400).send({ error: stderr || error.message });
      }
      res.status(200).send({ output: stdout });
    });
  } catch (error) {
    res.status(500).send({ error: 'Error running code' });
  }
});

// Save Score API
app.post('/saveScore', async (req, res) => {
  try {
    const { userId, score } = req.body;
    if (!userId || score === undefined) return res.status(400).send('User ID and score are required.');

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found.');

    user.score = Math.max(user.score, score);
    await user.save();
    res.status(200).send('Score saved successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving score');
  }
});

// Signup API
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).send('All fields are required.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(200).send('Signup successful!');
  } catch (error) {
    res.status(500).send('Error during signup');
  }
});

// Login API
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Both email and password are required.');

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid email or password.');

    res.status(200).send({ message: 'Login successful!', userId: user._id });
  } catch (error) {
    res.status(500).send('Error during login');
  }
});

// Fetch User Profile API
app.get('/getProfile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      location: user.location,
      twoFactorAuth: user.twoFactorAuth,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update Profile API
app.put('/updateProfile', async (req, res) => {
  try {
    const { userId, fullName, username, email, phone, dob, gender, location, password, twoFactorAuth } = req.body;

    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;
    user.location = location || user.location;
    user.twoFactorAuth = twoFactorAuth !== undefined ? twoFactorAuth : user.twoFactorAuth;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
