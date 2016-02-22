'use strict';

var app = angular
  .module('devconfama', [
    'ngAnimate',    
    'ngResource',
    'ngRoute',    
    'firebase'
  ])
  .constant('FURL', 'https://devconfama.firebaseio.com/')  
  .config(function ($routeProvider) {
    $routeProvider      
      .when('/', {
        templateUrl: 'views/browse.html',
        controller: 'QuestionController'
//        resolve: {
//            "currentAuth" : ["Auth", function (Auth) { return Auth.$waitForAuth(); }]
//        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
