app.factory("NewUser", function($resource) {
  return $resource("/users/:id", {routeID:'@id'},
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: false },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );
});
angular.module('AngularRails').controller('UpdateCtrl', ['$scope','NewUser','$location', function ($scope, NewUser, $location) {
  $scope.update = {};
  
  $scope.updateUser = function() {
    console.log($scope.newNeedChange);
    var user = NewUser.index({id:$scope.newNeedChange}, function() {
      if ($scope.profile_set) {
        user.username = $scope.update.name;
      }
      if ($scope.email_set) {
        user.email = $scope.update.email;
      }
      
      user.$update(function(data) {
        console.log(data);
        if (data.response == 'updated') {
          $scope.root.currentUser = $scope.update.name ? $scope.update.name : $scope.root.couldUsername;
          $scope.root.profile_set = false;
          $scope.root.email_set = false;
          $('#loginModal').closeModal();
          $location.path('/' + $scope.root.currentUser);
          Materialize.toast('Welcome, '+ $scope.root.currentUser + '. Your account is ready to go.', 4000);
        } else {
          Materialize.toast(data.response, 4000);
        }

      });
    });
  };
  
}]);