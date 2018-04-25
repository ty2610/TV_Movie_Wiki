var wikiApp = angular.module('wikiApp', []).config(['$locationProvider', function($locationProvider) { $locationProvider.html5Mode({ enabled: true, requireBase: false }); }]);

wikiApp.controller('wikiController', function wikiController($scope, $location) {
    $scope.primaryTitle = "error";

    $scope.search = () => {
        var paramCategory = $location.search().category;
        var paramSearchText = $location.search().searchText;
        if(paramCategory == "People"){

        }else if(paramCategory == "Title"){

        }else{
            //error
        }
        var url = "/searchTitlePerson"; //other router to make the http request
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
                $scope.primaryTitle = "hello world!";
            },
            error: function (error) {
                //alert(error);
                $scope.primaryTitle = "hello world";
            }
        });
    }
});