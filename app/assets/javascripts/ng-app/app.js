var app = angular.module('AngularRails', ['ui.materialize','ngRoute','ngResource','templates','Devise','ngAnimate']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'HomeCtrl'
        })
        .when('/:username', {
            templateUrl: 'user.html',
            controller: 'UserCtrl'
        });
    $locationProvider.html5Mode(true);
    
    
}]);

var ngLazyShowDirective = ['$animate', function ($animate) {

  return {
    multiElement: true,
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    link: function ($scope, $element, $attr, $ctrl, $transclude) {
      var loaded;
      $scope.$watch($attr.ngLazyShow, function ngLazyShowWatchAction(value) {
        if (loaded) {
          $animate[value ? 'removeClass' : 'addClass']($element, 'ng-hide');
        }
        else if (value) {
          loaded = true;
          $transclude(function (clone) {
            clone[clone.length++] = document.createComment(' end ngLazyShow: ' + $attr.ngLazyShow + ' ');
            $animate.enter(clone, $element.parent(), $element);
            $element = clone;
          });
        }
      });
    }
  };

}];

angular.module('AngularRails').directive('ngLazyShow', ngLazyShowDirective);