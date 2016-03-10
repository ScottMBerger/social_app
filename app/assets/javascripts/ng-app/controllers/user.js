

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


app.controller('UserCtrl', ['$scope', '$routeParams', 'User', function($scope, $routeParams, User){
  $scope.person = $routeParams.username;

  $scope.user = User.show();
  
  $scope.num = 5;
}]);

