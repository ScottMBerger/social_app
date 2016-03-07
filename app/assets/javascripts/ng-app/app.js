angular.module('AngularRails', ['ngRoute','templates'])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $routeProvider
          .when('/', {
              templateUrl: 'home.html',
              controller: 'HomeCtrl'
          })
          .when('/:id', {
              templateUrl: 'user.html',
              controller: 'UserCtrl'
          });
      $locationProvider.html5Mode(true);
  }]);