var indexApp = angular.module('indexApp', []);

indexApp.controller('IndexController', function IndexController($scope) {
    $scope.alert = (input) => {
        window.alert(input);
    };

    $scope.submitSearch = () => {
        var category = $("#categorySelect").val();
        var searchText = $("#searchBox").val();
        if ("" === searchText) {
            window.alert("You must include text to search for");
        } else if("Select A Value" === category){
            window.alert("You must select a category to search for");
        } else {
            /*var url = "/resultPage";
            var send = {category: category, searchText: searchText};
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
            });*/
            window.location.href = "/resultPage?category=" + category + "&searchText="+searchText
        }
    };
});