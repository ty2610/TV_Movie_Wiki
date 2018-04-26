$(document).ready(function() {
    $('body').hide();
    $(window).on('load', function() {
        $('body').show();
    });
});
var resultApp = angular.module('resultApp', []).config(['$locationProvider', function($locationProvider) { $locationProvider.html5Mode({ enabled: true, requireBase: false }); }]);

resultApp.controller('ResultController', function ResultController($scope, $location) {
    $scope.searchJSON;
    $scope.isPeople;

    $scope.submitSearch = () => {
        var category = $("#categorySelect").val();
        var searchText = $("#searchBox").val();
        if ("" === searchText) {
            window.alert("You must include text to search for");
        } else if("Select A Value" === category){
            window.alert("You must select a category to search for");
        } else {
            $scope.search(category, searchText);
        }
    };

    $scope.search = (cat,text) => {
        var paramCategory;
        var paramSearchText;
        if(cat!==undefined) {
            paramCategory = cat;
            paramSearchText = text;
        } else {
            paramCategory = $location.search().category;
            paramSearchText = $location.search().searchText;
        }

        if ("" === paramSearchText) {
            window.alert("You must include text to search for");
            return;
        } else if(paramCategory !== "People" && paramCategory !== "Title"){
            window.alert("You must select a correct category to search for");
            return;
        }

        if(paramCategory === "People") {
            $('#categorySelect option[value=People]').prop('selected', true);
        } else {
            $('#categorySelect option[value=Title]').prop('selected', true);
        }

        $('#searchBox').val(paramSearchText);
        var url = "/searchTitlePerson";
        var send = {category: paramCategory, searchText: paramSearchText};
        if(paramCategory === "People") {
            $scope.isPeople = true;
        } else {
            $scope.isPeople = false;
        }
        $.ajax({
            url: url,
            data: send,
            type: 'POST',
            cache: false,
            contentType: "application/x-www-form-urlencoded",
            success: (data) => {
                $scope.searchJSON = JSON.parse(data);
                $scope.$apply();
            },
            error: function (error) {
                alert(error);
            }
        });
    }
});