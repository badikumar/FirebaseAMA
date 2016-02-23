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
      })
      .otherwise({
        redirectTo: '/'
      });
  });
