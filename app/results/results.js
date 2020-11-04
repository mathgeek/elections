'use strict';

angular.module('electionsApp.results', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/results', {
    templateUrl: 'results/results.html',
    controller: 'resultsCtrl'
  });
}])

.controller('resultsCtrl', ['resultsService', function(resultsService) {
  return {
    texasResults: resultsService.get()
  }
}])

.factory('resultsService', ['$resource', function($resource) {
  return $resource('https://politics-elex-results.data.api.cnn.io/results/view/2020-PG-TX.json');
}]);