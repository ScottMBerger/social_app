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

angular.module('AngularRails').controller('HomeCtrl', ['$scope','$location', '$timeout', 'Auth', function ($scope, $location, $timeout, Auth) {
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
    console.log('checked auth');
  }, function(error) {
      console.log(error);
  });
  
  $scope.logout = function() {
    Auth.logout(config).then(function(oldUser) {
        $scope.currentUser = null;
        console.log("logged out");
        Materialize.toast('You have been logged out', 3000);
    }, function(error) {
        // An error occurred logging out.
    });

    $scope.$on('devise:logout', function(event, oldCurrentUser) {
        // ...
    });
  };
  
  $scope.profile = function () {
    $location.path('/' + $scope.currentUser);
  };

      
  $scope.register = function() {
      var credentials = {
          username: $scope.newUser.username,
          email: $scope.newUser.email,
          password: $scope.newUser.password,
          password_confirmation: $scope.newUser.passwordconfirmation
      };
      
      Auth.register(credentials, config).then(function(registeredUser) {
          console.log(registeredUser); // => {id: 1, ect: '...'}
          function registerDone() {
            $('#loginModal').closeModal();
            $location.path('/' + $scope.newUser.username);
            Materialize.toast('Welcome, '+ $scope.newUser.username + '. Your account is ready to go.', 4000);
          }
          $timeout(registerDone, 1000);

      }, function(error) {
          // Registration failed...
      });

      $scope.$on('devise:new-registration', function(event, user) {
          
      });
      
  };
  
  $scope.login = function() {
        var credentials = {
            login: $scope.user.username,
            password: $scope.user.password,
            remember_me: $scope.user.remember_me
        };

        Auth.login(credentials, config).then(function(user) {
            console.log(user); // => {id: 1, ect: '...'}
            $('#loginModal').closeModal();
            $location.path('/' + user.username);
            Materialize.toast("Welcome, " + user.username + ". You're logged in now.", 4000);
        }, function(error) {
            Materialize.toast("Login info doesn't match, retry", 4000);
        });

        $scope.$on('devise:login', function(event, currentUser) {
            // after a login, a hard refresh, a new tab
        });

        $scope.$on('devise:new-session', function(event, currentUser) {
            // user logged in by Auth.login({...})
        });
  };
  

 
  $scope.reset = function() {
        if (!$scope.user.username) {
          Materialize.toast("Please enter an Email or Username", 3000);
          return;
        }
        var parameters = {
            login: $scope.user.username
        };

        Auth.sendResetPasswordInstructions(parameters).then(function(data) {
            console.log(data);
            Materialize.toast("An email was sent, please check it to reset password", 4000);
         }, function(error) {
            console.log(error);
            Materialize.toast("Login info not found, please retry", 3000);
        });

        
        $scope.$on('devise:send-reset-password-instructions-successfully', function(event) {
           
        });
  }  

}]);
