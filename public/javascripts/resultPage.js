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
    $scope.useSpinner = false;
    $scope.spinnerImageCounter;

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
        $scope.useSpinner = true;
        var paramCategory;
        var paramSearchText;
        var titleType;
        var roleType;
        if(cat!==undefined) {
            paramCategory = cat;
            paramSearchText = text;
        } else {
            paramCategory = $location.search().category;
            paramSearchText = $location.search().searchText;
            titleType = $location.search().titleType;
            roleType = $location.search().roleType;
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
        var send = {category: paramCategory, searchText: paramSearchText, roleType: roleType, titleType: titleType};
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
                $scope.populatePhotos(paramCategory);
            },
            error: function (error) {
                alert(error);
            }
        });
    };

    $scope.populatePhotos = (category) => {
        $scope.spinnerImageCounter = $scope.searchJSON.length;
        for(var i=0; i<$scope.searchJSON.length; i++) {
            url = "/posterPopulate";
            var id;
            var selector;
            if(category === "People") {
                id = $scope.searchJSON[i].nconst;
                selector = "#posterP-";
            } else {
                id = $scope.searchJSON[i].tconst;
                selector = "#posterT-";
            }
            send = {id: id, category: category, increment: i};
            $.ajax({
                url: url,
                data: send,
                type: 'POST',
                cache: false,
                contentType: "application/x-www-form-urlencoded",
                success: (data) => {
                    $scope.spinnerImageCounter--;
                    if($scope.spinnerImageCounter<=0){
                        $scope.$apply();
                        $scope.useSpinner = false;
                    }
                    if(data !== "error") {
                        console.log("posters ajax success");
                        $scope.posterURL = "http://" + data.host + data.path;
                        $(selector + data.increment).attr("src", $scope.posterURL);
                        $scope.$apply();
                    }
                },
                error: function (error) {
                    $scope.spinnerImageCounter--;
                    if($scope.spinnerImageCounter<=0){
                        $scope.$apply();
                        $scope.useSpinner = false;
                    }
                    console.log("posters ajax error");
                    console.log(error);
                }
            });
        }
    };
});