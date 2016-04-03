
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
  var networkCounters = [];
  var highestCount = 0;
  var loginLoad = 0;
  
  function StartUser() {
      loginLoad++;
      if (loginLoad == 2) {
        return;
      }
      User.show().$promise.then(function(data) {
        if (data['user']) {
          console.log("this user is logged in");
          networkCounters = [];
          Object.keys(data['networks']).forEach(function (key) {
             networkCounters.push({c: '.'+key+'_counter', num: data['networks'][key]});
          });
        } else {
          console.log(data['response']);
        }
        $scope.goto = data['user'] ? 'self.html' : 'spectator.html';
        $scope.advanced = data;
        $scope.data = data;
        $scope.user = data['user'];
        
        console.log($scope.goto);
        setTimeout(function(){
      		$scope.loadDone = true;
      		$scope.$apply();
      		
      		if (data['user']) {
      		  highestCount = $scope.user.view_count;
        		Object.keys(networkCounters).forEach(function (key) {
               highestCount = networkCounters[key]['num'] > highestCount ? networkCounters[key]['num'] : highestCount;
            });
        		new Counter('.profile_counter', $scope.user.view_count);
        		Object.keys(networkCounters).forEach(function (key) {
               new Counter(networkCounters[key]['c'], networkCounters[key]['num']);
            });
      		}
      		
      	}, 1000);
    });
  }
  StartUser();
  console.log("log111");
  $scope.authNetworkAdd = function (network) {
      if ($scope.advanced['providers'].indexOf(network) == -1) {
        var openUrl = 'users/auth/' + network;
        window.$windowScope = $scope;
        window.open(openUrl, "Authenticate Account", "width=500, height=500");
      }
   };
   
  /*Count functions*/
  function pad(n, width, z) {
	  z = z || '0';
	  n = n + '';
	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
	
	function adjust(dotclass, countnumber) {
		$(dotclass).find('ul').each(function(i, el){
			var val = pad(countnumber, $scope.length, 0).split("");
			var $el = $(this);
			$el.removeClass();
			$el.addClass('goto-' + val[i]);
		});
	}
	
	function correctLength(init) {
		$scope.length = highestCount.toString().length > 3 || (highestCount.toString().length == 3 && init) ? highestCount.toString().length + 1 : 3;
		if (highestCount.toString().length >= 4 && (highestCount/(Math.pow(10,(highestCount.toString().length)))) < 0.6) {
			$scope.length = highestCount.toString().length;
		}
		$scope.counterLength = new Array($scope.length);
	}
  function Counter(dotclass, countnumber) {
      if ($scope.user) {
        correctLength(true);
        setTimeout(function(){
    			adjust(dotclass, countnumber);
    		}, 1000);

      	//this.okgo = function() {
      	//	this.count++;  
      	//	correctLength();
      	//	adjust();
      	//};
    
      }
  }
  /*End Count Functions*/
  
  $scope.root.$on('devise:login', function(event, currentUser) {
     console.log("loginon userjs");
     StartUser();
     $scope.goto = 'self.html';
  });
  $scope.root.$on('devise:logout', function(event, oldCurrentUser) {
    console.log("logouton userjs");
    loginLoad = -1;
    StartUser();
  });
  
  function onYtEvent(payload) {
    if (payload.eventType == 'subscribe') {
      // Add code to handle subscribe event.
    } else if (payload.eventType == 'unsubscribe') {
      // Add code to handle unsubscribe event.
    }
    if (window.console) { // for debugging only
      window.console.log('YT event: ', payload);
    }
  }
  
}]);

