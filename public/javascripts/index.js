var indexApp = angular.module('indexApp', []);

indexApp.controller('IndexController', function IndexController($scope) {
    $scope.myDropDown = 'Select A Value';
    $scope.submitSearch = () => {
        var category = $("#categorySelect").val();
        var searchText = $("#searchBox").val();
        var titleType = $("#inputTitleType").val();
        var roleType = $("#roleSelect").val();
        if ("" === searchText) {
            window.alert("You must include text to search for");
        } else if("Select A Value" === category){
            window.alert("You must select a category to search for");
        } else {
            var append = "";
            if(titleType !== undefined && titleType !== "All") {
                append = "&titleType=" + titleType;
            }

            var roleAppend = "";
            if(roleType !== undefined && roleType !== "All") {
                roleAppend = "&roleType=" + roleType;
            }

            var url;
            if(category === "Title"){
                url = "/resultPage?category=" + category + "&searchText="+searchText + append;
            } else {
                url = "/resultPage?category=" + category + "&searchText="+searchText + roleAppend;
            }
            window.location.href = url;
        }
    };
});