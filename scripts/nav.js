'use strict';

app.controller('NavController', function (authsvc, $scope) {

    $scope.signedIn = authsvc.signedIn;

    $scope.logout = function () {
        authsvc.logout();
        $scope.currentUser = {};
    };

    authsvc.auth.$onAuth(function (authData) {
        $scope.currentUser = authsvc.getUserProfile(authData);
    });


});