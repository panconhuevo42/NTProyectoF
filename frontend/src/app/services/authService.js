angular.module('preventaApp')
.factory('AuthService', function($http, $window) {
  const api = 'http://localhost:5000/api/auth'; // Cambiado de 3000 → 5000
  let token = $window.localStorage.getItem('token');

  function saveToken(t) {
    token = t;
    $window.localStorage.setItem('token', t);
  }

  function getToken() {
    return token;
  }

  return {
    register: (data) =>
      $http.post(api + '/register', data)
        .then(r => { saveToken(r.data.token); return r.data; }),

    login: (data) =>
      $http.post(api + '/login', data)
        .then(r => { saveToken(r.data.token); return r.data; }),

    logout: () => {
      token = null;
      $window.localStorage.removeItem('token');
    },

    getToken
  };
});



