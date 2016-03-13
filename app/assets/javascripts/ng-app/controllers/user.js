
app.factory("User", function($resource, $routeParams) {
  return $resource("/users/:username", { username: $routeParams.username },
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );
});


app.controller('UserCtrl', ['$scope', '$routeParams', 'User', 'Auth', function($scope, $routeParams, User, Auth){
  $scope.person = $routeParams.username;

  User.show().$promise.then(function(data) {
      $scope.goto = data.username ? 'self.html' : 'spectator.html';
      $scope.user = data;
  });

        
}]);

