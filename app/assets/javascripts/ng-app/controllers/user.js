
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
      
      if ($scope.user.username) {
        function pad(n, width, z) {
      	  z = z || '0';
      	  n = n + '';
      	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      	}
      	function adjust() {
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
  });


  
}]);

