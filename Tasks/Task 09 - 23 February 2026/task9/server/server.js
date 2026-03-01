require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const issueRoutes = require('./routes/issueRoutes');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');

// Routes will go here
app.use('/api/auth', authRoutes);
app.use('/api/books', protect, bookRoutes);
app.use('/api/members', protect, memberRoutes);
app.use('/api/issues', protect, issueRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running normally' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
