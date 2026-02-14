const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

console.log("API Key configured:", process.env.AI_API_KEY ? "YES (" + process.env.AI_API_KEY.substring(0, 5) + "...)" : "NO");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('BrajCoders Health Platform API is running...');
});

// Import Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
