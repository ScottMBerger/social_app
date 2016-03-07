angular.module('AngularRails', ['ngRoute','templates'])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $routeProvider
          .when('/', {
              templateUrl: 'home.html',
              controller: 'HomeCtrl'
          });
      $locationProvider.html5Mode(true);
  }]);