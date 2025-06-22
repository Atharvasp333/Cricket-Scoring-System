// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import tournamentRoutes from './routes/tournamentRoutes.js';
import matchRoutes from './routes/matchRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uri = "mongodb+srv://CricketZ:sQDCJ1o5VVJ31eSo@cluster0.s2bbf6d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Health check route
app.get('/', (req, res) => {
  res.send('Cricket Scoring System Backend is running');
});

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/matches', matchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});