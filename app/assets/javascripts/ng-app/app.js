var app = angular.module('AngularRails', ['ui.materialize','ngRoute','ngResource','templates','Devise']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'HomeCtrl'
        })
        .when('/:username', {
            templateUrl: 'user.html',
            controller: 'UserCtrl'
        });
    $locationProvider.html5Mode(true);
    
    
}]);
