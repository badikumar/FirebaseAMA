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
        restrict: 'A',   // 'A' is the default; could remove this line
        scope: { flag:"=" },
        link: function (scope, element) {
            var offsetTop = element.offset().top;
            $win.on('scroll', function (e) {
                if ($win.scrollTop() >= offsetTop) {
                    scope.flag = true;
                }else{
                    scope.flag = false;
                }
                scope.$apply();
            });
        }
    };
  })
  .config(function (FURL,$routeProvider, $firebaseRefProvider) {

    $firebaseRefProvider.registerUrl({
      default:FURL,
      users: FURL + '/users',
      questions: FURL + '/questions'
    });

    $routeProvider      
      .when('/', {
        templateUrl: 'views/browse.html',
        controller: 'QuestionController',
        resolve: {
            authServe: function($firebaseAuthService){
              return $firebaseAuthService.$waitForAuth();
            }
        }
      })
      .otherwise({
        redirectTo: '/'
      });

  });
