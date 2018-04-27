var wikiApp = angular.module('wikiApp', []).config(['$locationProvider', function($locationProvider) { $locationProvider.html5Mode({ enabled: true, requireBase: false }); }]);

wikiApp.controller('wikiController', function wikiController($scope, $location) {
    $scope.category = $location.search().category;
    $scope.title = "Loading...";

    $scope.populate = () => {
        var paramCategory = $scope.category;
        var id = $location.search().id;
        var url = "/wikiPopulate";
        var send = {id: id, paramCategory: paramCategory};
        $.ajax({
            url: url,
            data: send,
            type: 'POST',
            cache: false,
            contentType: "application/x-www-form-urlencoded",
            success: (data) => {
                console.log("ajax success");
                if(paramCategory == "Title"){
                    $scope.parseTitle(JSON.parse(data));
                }else{
                    $scope.parsePerson(JSON.parse(data));
                }
                $scope.$apply();
            },
            error: function (error) {
                console.log("ajax error");
                console.log(error);
            }
        });
        if(paramCategory == "Title"){
            send = {id: id, paramCategory: "Principals"};
            $.ajax({
                url: url,
                data: send,
                type: 'POST',
                cache: false,
                contentType: "application/x-www-form-urlencoded",
                success: (data) => {
                    console.log("principals ajax success");
                    $scope.principalObj = JSON.parse(data);
                    $scope.$apply();
                    $scope.populatePincipalPoster();
                },
                error: function (error) {
                    console.log("principals ajax error");
                    console.log(error);
                }
            });
            url = "/posterPopulate";
            send = {id: id, category: "Title"};
            $.ajax({
                url: url,
                data: send,
                type: 'POST',
                cache: false,
                contentType: "application/x-www-form-urlencoded",
                success: (data) => {
                    if(data !== "error") {
                        console.log("posters ajax success");
                        $scope.posterURL = "http://" + data.host + data.path;
                        $("#poster").attr("src", $scope.posterURL);
                        $scope.$apply();
                    }
                },
                error: function (error) {
                    console.log("posters ajax error");
                    console.log(error);
                }
            });
        }
    };

    $scope.parsePerson = (dataJson) => {
        console.log("parsing Person...");
        console.log(dataJson);
        if(dataJson.length > 1){
            console.log("Error: too many results");
        }else{
            var data = dataJson[0];
            if(data !== undefined) {
                $scope.title = data.primary_name;
                $scope.primaryName = data.primary_name;
                $scope.birthYear = data.birth_year;
                $scope.deathYear = data.death_year;
                $scope.professions = data.primary_profession.charAt(0).toUpperCase() + data.primary_profession.slice(1);
                $scope.professions = $scope.professions.replace(/,/g, ", ");
                var titlesArr = data.known_for_titles.split(',');
                console.log(titlesArr);
                $.ajax({
                    url: "/wikiPopulate",
                    data: {id: data.known_for_titles, paramCategory: "getTitles"},
                    type: 'POST',
                    cache: false,
                    contentType: "application/x-www-form-urlencoded",
                    success: (data) => {
                        console.log("titles ajax success");
                        $scope.titlesJSON = JSON.parse(data);
                        $scope.$apply();
                        $scope.populateKnownPosters();
                    },
                    error: function (error) {
                        console.log("principals ajax error");
                        console.log(error);
                    }
                });
            }
            url = "/posterPopulate";
            var id;
            if(data === undefined) {
                id = $location.search().id;
            } else {
                id = data.nconst;
            }
            send = {id: id, category: "People"};
            $.ajax({
                url: url,
                data: send,
                type: 'POST',
                cache: false,
                contentType: "application/x-www-form-urlencoded",
                success: (data) => {
                    if(data!=="error") {
                        console.log("posters ajax success");
                        $scope.posterURL = "http://" + data.host + data.path;
                        $("#poster").attr("src", $scope.posterURL);
                        $scope.$apply();
                    }
                },
                error: function (error) {
                    console.log("posters ajax error");
                    console.log(error);
                }
            });
        }
    };

    $scope.parseTitle = (dataJson) => {
        console.log("parsing Title...");
        if(dataJson.length > 1){
            console.log("Error: too many results");
        }else{
            var data = dataJson[0];
            $scope.title = data.primary_title;
            $scope.primaryTitle = data.primary_title;
            $scope.startYear = data.start_year;
            $scope.endYear = data.end_year;
            $scope.titleType = data.title_type.charAt(0).toUpperCase() + data.title_type.slice(1);
            $scope.runtime = data.runtime_minutes;
            $scope.genreList = data.genres.replace(/,/g, ", ");
            $scope.rating = data.average_rating;
            $scope.votes = data.num_votes;
        }
    };

    $scope.populateKnownPosters = () => {
        for(var i=0; i<$scope.titlesJSON.length; i++) {
            var category = "Title";
            var id = $scope.titlesJSON[i].tconst;
            var selector = "#posterK-";
            var url = "/posterPopulate";
            send = {id: id, category: category, increment: i};
            $.ajax({
                url: url,
                data: send,
                type: 'POST',
                cache: false,
                contentType: "application/x-www-form-urlencoded",
                success: (data) => {
                    if (data !== "error") {
                        console.log("posters ajax success");
                        $scope.posterURL = "http://" + data.host + data.path;
                        $(selector + data.increment).attr("src", $scope.posterURL);
                        $scope.$apply();
                    }
                },
                error: function (error) {
                    console.log("posters ajax error");
                    console.log(error);
                }
            });
        }
    };

    $scope.populatePincipalPoster = () => {
        for(var i=0; i<$scope.principalObj.length; i++) {
            var category = "People";
            var id = $scope.principalObj[i].nconst;
            var selector = "#posterC-";
            var url = "/posterPopulate";
            send = {id: id, category: category, increment: i};
            $.ajax({
                url: url,
                data: send,
                type: 'POST',
                cache: false,
                contentType: "application/x-www-form-urlencoded",
                success: (data) => {
                    if (data !== "error") {
                        console.log("posters ajax success");
                        $scope.posterURL = "http://" + data.host + data.path;
                        $(selector + data.increment).attr("src", $scope.posterURL);
                        $scope.$apply();
                    }
                },
                error: function (error) {
                    console.log("posters ajax error");
                    console.log(error);
                }
            });
        }
    }
});