angular.module('preventaApp')
.factory('UserService', function($http, AuthService) {
  const base = 'http://localhost:5000/api/usuarios'; // Cambiado de 3000 → 5000, español

  function headers() {
    return { headers: { Authorization: 'Bearer ' + AuthService.getToken() } };
  }

  return {
    // Obtener los datos del usuario autenticado
    me: () =>
      $http.get(base + '/me', headers()),

    // Depositar saldo en la billetera
    deposit: (amount) =>
      $http.post(base + '/depositar', { amount }, headers())
  };
});
