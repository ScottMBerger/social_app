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

angular.module('AngularRails').controller('HomeCtrl', ['$scope','$location', 'Auth', function ($scope, $location, Auth) {
  $scope.slogan = 'A site for social network aggregation';
  $scope.newUser = {};
  $scope.user = {};
  $scope.currentUser = null;

  var config = {
      headers: {
          'X-HTTP-Method-Override': 'POST'
      }
  };
  
  Auth.currentUser().then(function(user) {
    $scope.currentUser = user.username;
    console.log(user.username);
    console.log(user);
  }, function(error) {
      console.log(error);
  });
  
  $scope.logout = function() {
    Auth.logout(config).then(function(oldUser) {
        $scope.currentUser = null;
        console.log("logged out");
        Materialize.toast('You have been logged out', 2000)
    }, function(error) {
        // An error occurred logging out.
    });

    $scope.$on('devise:logout', function(event, oldCurrentUser) {
        // ...
    });
  }
  
  $scope.profile = function () {
    $location.path('/' + $scope.currentUser);
  }

      
  $scope.register = function() {
      var credentials = {
          username: $scope.newUser.username,
          email: $scope.newUser.email,
          password: $scope.newUser.password,
          password_confirmation: $scope.newUser.passwordconfirmation
      };
      
      Auth.register(credentials, config).then(function(registeredUser) {
          console.log(registeredUser); // => {id: 1, ect: '...'}
          $location.path('/' + $scope.newUser.username);
      }, function(error) {
          // Registration failed...
      });

      $scope.$on('devise:new-registration', function(event, user) {
          
      });
      
  };
  
  $scope.login = function() {
        var credentials = {
            login: $scope.user.username,
            password: $scope.user.password
        };

        Auth.login(credentials, config).then(function(user) {
            console.log(user); // => {id: 1, ect: '...'}
            $location.path('/' + user.username);
        }, function(error) {
            // Authentication failed...
        });

        $scope.$on('devise:login', function(event, currentUser) {
            // after a login, a hard refresh, a new tab
        });

        $scope.$on('devise:new-session', function(event, currentUser) {
            // user logged in by Auth.login({...})
        });
  }

}]);
