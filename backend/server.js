'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');

// Jobs
require('./jobs/releaseReservations');

// Rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/games');
const reservationRoutes = require('./routes/reservations');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Conexión a MongoDB Atlas
const mongoURI = process.env.MONGO_URI;

console.log('🔍 Intentando conectar a:', mongoURI); // Verifica que se lea la variable

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(`✅ Conectado correctamente a MongoDB Atlas`);
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});

// 🔹 Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/reservations', reservationRoutes);

// 🔹 Servir frontend (AngularJS)
const FRONTEND_PATH = path.join(__dirname, '../frontend/src');
app.use(express.static(FRONTEND_PATH));

app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});
