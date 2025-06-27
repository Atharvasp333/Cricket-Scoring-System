// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import matchStateRoutes from './routes/matchStateRoutes.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // Allow all origins for dev; restrict in production
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Health check route
app.get('/', (req, res) => {
  res.send('Cricket Scoring System Backend is running');
});

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/matchStates', matchStateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/players', (await import('./routes/PstatsRoutes.js')).default);

// Example: log connections
io.on('connection', (socket) => {
  console.log('A viewer connected:', socket.id);
  // For testing: emit a dummy event after connection
  // socket.emit('matchUpdated', { _id: 'test', status: 'Live', team1: { name: 'Test1' }, team2: { name: 'Test2' } });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
