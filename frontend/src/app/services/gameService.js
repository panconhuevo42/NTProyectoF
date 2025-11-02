// frontend/services/gameService.js
angular.module('preventaApp').service('gameService', ['$http', function($http) {

  const baseUrl = 'http://localhost:5000/api/juegos'; // provoca CORS

  this.getAll = function() {
    return $http.get(baseUrl);
  };

  this.create = function(game) {
    return $http.post(baseUrl, game);
  };

  this.update = function(game) {
    return $http.put(baseUrl + '/' + game._id, game);
  };

  this.delete = function(id) {
    return $http.delete(baseUrl + '/' + id);
  };

}]);

