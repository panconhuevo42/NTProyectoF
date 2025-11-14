// jobs/releaseReservations.js
const cron = require('node-cron');
const Reservation = require('../models/Reservation');
const Game = require('../models/Game');

// Tarea programada para actualizar reservas cuando los juegos son lanzados
cron.schedule('0 * * * *', async () => { // Ejecutar cada hora, no cada minuto
  try {
    console.log('🔄 Ejecutando job: Actualización de reservas por lanzamiento...');
    
    const now = new Date();
    
    // Buscar juegos que acaban de ser lanzados
    const recentlyReleasedGames = await Game.find({
      releaseDate: { $lte: now },
      available: true
    });

    console.log(`🎯 Encontrados ${recentlyReleasedGames.length} juegos lanzados`);

    for (const game of recentlyReleasedGames) {
      // Actualizar reservas activas de este juego a "completed"
      const result = await Reservation.updateMany(
        { 
          gameId: game._id, 
          status: 'active' 
        },
        { 
          $set: { 
            status: 'completed',
            completedAt: now
          } 
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ ${result.modifiedCount} reservas marcadas como completadas para: ${game.title}`);
      }

      // Marcar el juego como no disponible para preventa
      game.available = false;
      await game.save();
    }

    console.log('✅ Job de actualización de reservas completado');
    
  } catch (err) {
    console.error('❌ Error en job releaseReservations:', err);
  }
});

// Exportar para poder controlar el job si es necesario
module.exports = cron;