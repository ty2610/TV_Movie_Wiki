var resultApp = angular.module('resultApp', []).config(['$locationProvider', function($locationProvider) { $locationProvider.html5Mode({ enabled: true, requireBase: false }); }]);

resultApp.controller('ResultController', function ResultController($scope, $location) {
    $scope.search = () => {
        var paramCategory = $location.search().category;
        var paramSearchText = $location.search().searchText;
        var url = "/searchTitlePerson";
        var send = {category: paramCategory, searchText: paramSearchText};
        $.ajax({
            url: url,
            data: send,
            type: 'POST',
            cache: false,
            contentType: "application/x-www-form-urlencoded",
            success: function (data) {
                var newData = JSON.parse(data);
                var block = 0;
            },
            error: function (error) {
                alert(error);
            }
        });
    }
});