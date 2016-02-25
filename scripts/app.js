'use strict';

var app = angular
  .module('devconfama', [
    'ngAnimate',    
    'ngResource',
    'ngRoute',    
    'firebase'
  ])
  .constant('FURL', 'https://devconfama.firebaseio.com/')
  .directive('onScrollOver', function($window){
      var $win = angular.element($window);
      return {
        restrict: 'A',   // 'A' is the default, so you could remove this line
        scope: false,
        link: function (scope, element) {
            var offsetTop = element.offset().top;
            $win.on('scroll', function (e) {
                if ($win.scrollTop() >= offsetTop) {
                    scope.showaddbutton = true;
                }else{
                    scope.showaddbutton = false;
                }
                scope.$apply();
            });
        }
    };
  })
  .config(function ($routeProvider) {
    $routeProvider      
      .when('/', {
        templateUrl: 'views/browse.html',
        controller: 'QuestionController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
