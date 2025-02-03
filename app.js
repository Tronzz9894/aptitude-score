import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cors from 'cors';

// Directly include your MongoDB URI here
const MONGO_URI = 'mongodb+srv://mani:mani9896@cluster0.j8c6a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

console.log("MONGO_URI:", MONGO_URI);

// Check if MONGO_URI is defined
if (!MONGO_URI) {
  console.error('Error: MONGO_URI is not defined');
  process.exit(1); // Stop the server if MONGO_URI is not defined
}

const app = express();
const port = 3001;

app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Ensure JSON parsing

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Stop the server if MongoDB connection fails
  });

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  score: { type: Number, default: 0 }, // Add score to user schema
});

const User = mongoose.model('User', userSchema);

// Save Score Route
app.post('/saveScore', async (req, res) => {
  try {
    const { userId, score } = req.body;

    if (!userId || score === undefined) {
      return res.status(400).send('User ID and score are required.');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    user.score = score; // Save the score
    await user.save();

    res.status(200).send('Score saved successfully!');
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).send('Error saving score');
  }
});

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send('All fields are required.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(200).send('Signup successful!');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Error during signup');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Both email and password are required.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password.');
    }

    res.status(200).send({ message: 'Login successful!', userId: user._id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
