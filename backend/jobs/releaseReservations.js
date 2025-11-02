// jobs/releaseReservations.js
const cron = require('node-cron');
const Reservation = require('../models/Reservation');
const Game = require('../models/Game');

// Este código ya se programa automáticamente al cargar el archivo
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const pendingReservations = await Reservation.find({ estado: 'pendiente' }).populate('gameId');
    for (const r of pendingReservations) {
      const game = r.gameId;
      if (!game) continue;
      if (game.fechaLanzamiento <= now) {
        r.estado = 'completada';
        await r.save();
        console.log(`Reserva ${r._id} completada (juego ${game.titulo})`);
      }
    }
  } catch (err) {
    console.error('Error job releaseReservations:', err);
  }
});
