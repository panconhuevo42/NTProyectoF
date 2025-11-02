angular.module('preventaApp')
.factory('ReservationService', function($http, AuthService) {
  const base = 'http://localhost:5000/api/reservas'; // Cambiado de 3000 → 5000, y a plural español

  function headers() {
    return { headers: { Authorization: 'Bearer ' + AuthService.getToken() } };
  }

  return {
    // Crear una nueva reserva
    create: (gameId, cantidad) =>
      $http.post(base, { gameId, cantidad }, headers()),

    // Cancelar una reserva
    cancel: (id) =>
      $http.post(base + '/' + id + '/cancelar', {}, headers()),

    // Listar reservas del usuario
    list: () =>
      $http.get(base, headers())
  };
});
