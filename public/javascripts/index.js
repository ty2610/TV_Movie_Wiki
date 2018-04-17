var indexApp = angular.module('indexApp', []);

indexApp.controller('IndexController', function IndexController($scope) {
    //ALL JS GOES IN HERE
    $scope.alert = (input) => {
        window.alert(input);
    };

    $scope.callTestSQL = () => {
        var url = "/test";
        var send = {};
        $.ajax({
            url: url,
            data: send,
            type: 'GET',
            cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var newData = JSON.parse(data);
                var block = 0;
            },
            error: function (error) {
                alert(error);
            }
        });
    };
});