/*console.log("yy");
var HomeCtrl = function ($scope, $pusher) {
    var client = new Pusher('1f288f0620a39bfe75a4');
    var pusher = $pusher(client);
    var my_channel = pusher.subscribe('test_channel');
    $scope.result = 0;
    my_channel.bind('my_event',
      function(data) {
        $scope.result++;
      }
    );
    $scope.things = ['Angular', 'Rails 4.2.2','Pusher', 'Working', 'Together!!'];
};
HomeCtrl.$inject = ['$scope', '$pusher'];   


angular.module('AngularRails').controller('HomeCtrl', HomeCtrl).
  controller('UserCtrl', ['$scope', '$routeParams', function($scope, $routeParams){
    $scope.person = $routeParams.id
  }]);*/

angular.module('AngularRails').controller('HomeCtrl', ['$scope', 'Auth', function ($scope, Auth) {
  $scope.things = ['Angular', 'Rails 4.1', 'Working', 'Together!!'];
  
  var credentials = {
      email: 'user@domain.com',
      password: 'password1',
      password_confirmation: 'password1'
  };
  var config = {
      headers: {
          'X-HTTP-Method-Override': 'POST'
      }
  };
  
  Auth.register(credentials, config).then(function(registeredUser) {
      console.log(registeredUser); // => {id: 1, ect: '...'}
  }, function(error) {
      // Registration failed...
  });
  
  $scope.$on('devise:new-registration', function(event, user) {
     console.log(user);
  });
}]);