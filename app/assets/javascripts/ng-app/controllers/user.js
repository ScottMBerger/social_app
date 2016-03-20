
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


app.controller('UserCtrl', ['$scope', '$routeParams', 'User', 'Auth', '$http', function($scope, $routeParams, User, Auth, $http){
  $scope.person = $routeParams.username;

  $scope.loadDone = false;
  setTimeout(function(){
		$scope.loadDone = true;
		$scope.$apply();
		Counter();
	}, 2500);
      		
  User.show().$promise.then(function(data) {
      console.log(data);
      $scope.goto = data.user.username ? 'self.html' : 'spectator.html';
      $scope.advanced = data;
      $scope.user = data.user;
      
      $http({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mySubscribers=true&key={x67yDqjfYgDyxH12dSjFztaP}'
      }).then(function successCallback(response) {
        console.log(response);
      }, function errorCallback(response) {
        console.log(response);
      });
  });
  
  $scope.authNetworkAdd = function (network) {
      if ($scope.advanced['providers'].indexOf(network) == -1) {
        var openUrl = 'users/auth/' + network;
        window.$windowScope = $scope;
        window.open(openUrl, "Authenticate Account", "width=500, height=500");
      }
   };
   
  function Counter() {
      if ($scope.user.username) {
        $scope.currentUser = $scope.user.username;
        
        function pad(n, width, z) {
      	  z = z || '0';
      	  n = n + '';
      	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      	}
      	function adjust() {
      	  console.log(adjust);
      		$('.cou-item').find('ul').each(function(i, el){
      			var val = pad($scope.count, $scope.length, 0).split("");
      			var $el = $(this);
      			$el.removeClass();
      			$el.addClass('goto-' + val[i]);
      		})
      	}
      	function correctLength(init) {
      		$scope.length = $scope.count.toString().length > 3 || ($scope.count.toString().length == 3 && init) ? $scope.count.toString().length + 1 : 3;
      		if ($scope.count.toString().length >= 4 && ($scope.count/(Math.pow(10,($scope.count.toString().length)))) < 0.6) {
      			$scope.length = $scope.count.toString().length;
      		}
      		$scope.counterLength = new Array($scope.length);
      	}
      	function initCountNum(count) {
      	  console.log('init');
      		$scope.count =  count;
      		correctLength(true);
      		
      		setTimeout(function(){
      			adjust();
      		}, 1000);
      	}
      	$scope.okgo = function() {
      		$scope.count++;  
      		correctLength();
      		adjust();
      	}
      	
      	initCountNum($scope.user.view_count);      
      }
  }

  
}]);

