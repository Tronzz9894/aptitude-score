import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { exec } from 'child_process'; // For executing code

const MONGO_URI = 'mongodb+srv://mani:mani9896@cluster0.j8c6a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());  // Ensures the server can parse JSON request bodies

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  score: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

// New route for running code
app.post('/runCode', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).send('Code is required.');

    // Execute the JavaScript code using child process
    exec(`node -e "${code}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(400).send({ error: 'Error executing code: ' + error.message });
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(400).send({ error: 'Error executing code: ' + stderr });
      }
      // Send the output back
      res.status(200).send({ output: stdout });
    });
  } catch (error) {
    res.status(500).send({ error: 'Error running code' });
  }
});

// Save Score Route
app.post('/saveScore', async (req, res) => {
  try {
    const { userId, score } = req.body;
    if (!userId || score === undefined) return res.status(400).send('User ID and score are required.');

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found.');

    user.score = score;
    await user.save();
    res.status(200).send('Score saved successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving score');
  }
});

// Signup Route
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

// Login Route
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

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
