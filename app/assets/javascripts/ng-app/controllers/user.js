angular.module('AngularRails')

    .controller('UserCtrl', ['$scope', '$routeParams', function($scope, $routeParams){
      $scope.person = $routeParams.id
    }])
    
    ;