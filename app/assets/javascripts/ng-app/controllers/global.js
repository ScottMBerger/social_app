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
/*global app*/
/*global angular*/
/*global Materialize*/


angular.module('AngularRails').controller('GlobalCtrl', ['$scope','$location', '$timeout', 'Auth', '$http', function ($scope, $location, $timeout, Auth, $http) {
  $scope.root = $scope;
  $scope.slogan = 'A site for social network aggregation';
  $scope.newUser = {};
  $scope.user = {};
  $scope.currentUser = null;

  var config = {
      headers: {
          'X-HTTP-Method-Override': 'POST'
      }
  };
  
  function checkLogin() {
    Auth.currentUser().then(function(user) {
      if (user.profile_set == 'yes' && user.email_set == 'yes') {
         $scope.currentUser = user.username;
        
      } else {
        console.log('check not set');
        $scope.currentUser = null;
      }
     
      //console.log(user.username);
      console.log('checkLogin()');
    }, function(error) {
        $scope.currentUser = null;
        console.log(error);
    });
  };
  checkLogin();
  
  $scope.logout = function() {
    Auth.logout(config).then(function(oldUser) {
        $scope.currentUser = null;
        console.log("logout()");
        checkLogin();
        Materialize.toast('You have been logged out', 3000);
    }, function(error) {
        console.log(error);
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
          profile_set: 'yes',
          email_set: 'yes',
          email: $scope.newUser.email,
          password: $scope.newUser.password,
          password_confirmation: $scope.newUser.passwordconfirmation
      };
      
      Auth.register(credentials, config).then(function(registeredUser) {
          console.log(registeredUser); // => {id: 1, ect: '...'}
          function registerDone() {
            $scope.currentUser = $scope.newUser.username;
            $('#loginModal').closeModal();
            $location.path('/' + $scope.newUser.username);
            Materialize.toast('Welcome, '+ $scope.newUser.username + '. Your account is ready to go.', 4000);
          }
          $timeout(registerDone, 1000);

      }, function(error) {
          $scope.regError = error.data.errors;
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
            $scope.currentUser = user.username;
            $location.path('/' + user.username);
            Materialize.toast("Welcome, " + user.username + ". You're logged in now.", 4000);
        }, function(error) {
            $scope.logError = error.data.error;
            Materialize.toast("Login info doesn't match, retry", 4000);
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

   $scope.handlePopupAuthentication = function handlePopupAuthentication(account) {
      account = angular.fromJson(account);
      console.log(account);
      $scope.newNeedChange = account.id;
      continueLogin = true;
      
      if (account.email_set != 'yes') {
        $scope.email_set = true;
        $scope.$apply();
        continueLogin = false;
      }  
      if (account.profile_set != 'yes') {
        $scope.profile_set = true;
        $scope.$apply();
        continueLogin = false;
      } 
      
      if (continueLogin == true) {
        $scope.login();
        checkLogin();
      }
   }

   $scope.authNetwork = function authNetwork(network) {
      var openUrl = 'users/auth/' + network;
      window.$windowScope = $scope;
      window.open(openUrl, "Authenticate Account", "width=500, height=500");
   };
   
   $scope.$on('devise:new-session', function(event, currentUser) {
       console.log("new session");
    });
    
    $scope.$on('devise:login', function(event, currentUser) {
       //console.log(event);
       //console.log(currentUser);
    });
}]);