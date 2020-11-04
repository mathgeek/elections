'use strict';

// Declare app level module which depends on views, and core components
angular.module('electionsApp', [
  'ngRoute',
  'ngResource',
  'electionsApp.results'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/results'});
}]);
