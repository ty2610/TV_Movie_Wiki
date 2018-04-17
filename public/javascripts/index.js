var indexApp = angular.module('indexApp', []);

indexApp.controller('IndexController', function IndexController($scope) {
    //ALL JS GOES IN HERE
    $scope.alert = function(input) {
        window.alert(input);
    }
});