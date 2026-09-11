import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());

// JSON Body Parser
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Socket.io for Real-time Voice & Status updates
const io = new Server(server, {
  cors: {
    origin: '*', // For demo purposes, allow all origins
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Receive voice stream from client
  socket.on('voice-stream', (audioChunk) => {
    // In a real app, send chunks to STT service (e.g., Whisper, Bhashini)
    // console.log('Received audio chunk length:', audioChunk.length);
  });

  // Mock transcription sending back to client
  socket.on('simulate-transcription', (text) => {
    // Send transcription back to client
    socket.emit('transcription', { text, isFinal: true });
  });

  // Status updates
  socket.on('subscribe-status', (applicationId) => {
    socket.join(`app_${applicationId}`);
    console.log(`Socket ${socket.id} subscribed to status of app_${applicationId}`);
  });

  // Simulate status change
  socket.on('simulate-status-change', ({ applicationId, newStatus }) => {
    io.to(`app_${applicationId}`).emit('status-update', {
      applicationId,
      status: newStatus,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`SamriddhiSetu Server running on port ${PORT}`);
});
