var wikiApp = angular.module('wikiApp', []).config(['$locationProvider', function($locationProvider) { $locationProvider.html5Mode({ enabled: true, requireBase: false }); }]);

wikiApp.controller('wikiController', function wikiController($scope, $location) {
    $scope.category = $location.search().category;
    $scope.id = $location.search().id;
    $scope.edit = false;
    $scope.useSpinner = false;
    $scope.spinnerImageCounter;

    $scope.populate = () => {
        $scope.useSpinner = true;
        var paramCategory = $scope.category;
        var id = $scope.id;
        var url = "/wikiPopulate";
        var send = {id: id, paramCategory: paramCategory};
        $.ajax({
            url: url,
            data: send,
            type: 'POST',
            cache: false,
            contentType: "application/x-www-form-urlencoded",
            success: (data) => {
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
        $scope.spinnerImageCounter = $scope.titlesJSON.length;
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
                    $scope.spinnerImageCounter--;
                    if($scope.spinnerImageCounter<=0){
                        $scope.$apply();
                        $scope.useSpinner = false;
                    }
                    if (data !== "error") {
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

    $scope.populatePincipalPoster = () => {
        $scope.spinnerImageCounter = $scope.principalObj.length;
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
                    $scope.spinnerImageCounter--;
                    if($scope.spinnerImageCounter<=0){
                        $scope.useSpinner = false;
                        $scope.$apply();
                    }
                    if (data !== "error") {
                        console.log("posters ajax success");
                        $scope.posterURL = "http://" + data.host + data.path;
                        $(selector + data.increment).attr("src", $scope.posterURL);
                        $scope.$apply();
                    }
                },
                error: function (error) {
                    $scope.spinnerImageCounter--;
                    if($scope.spinnerImageCounter<=0){
                        $scope.useSpinner = false;
                        $scope.$apply();
                    }
                    console.log("posters ajax error");
                    console.log(error);
                }
            });
        }
    }

    $scope.updateTitle = () => {
        var var1 = $('#inputTitleType').val();
        $scope.titleType = var1;
        var var2 = $('#genreSelect').val().join(", ");
        $scope.genreList = var2;
        var id = $scope.id;
        var paramCategory = $scope.category;
        console.log("var1: " + var1 + " var2: " + var2 + " id: " + id + " paramCategory:" + paramCategory);

        $.ajax({
            url: "/wikiUpdate",
            data: {var1: var1, var2: var2, id: id, paramCategory: paramCategory},
            type: 'POST',
            cache: false,
            contentType: "application/x-www-form-urlencoded",
            success: (data) => {
                console.log("update ajax success");
                console.log(JSON.parse(data));
            },
            error: function (error) {
                console.log("update ajax error");
                console.log(error);
            }
        });
    }

    $scope.updatePerson = () => {
        var var1 = $('#birthYearInput').val();
        $scope.birthYear = var1;
        var var2 = $('#deathYearInput').val();
        $scope.deathYear = var2;
        var var3 = $('#professionsSelect').val().join(", ");
        $scope.professions = var3;
        var id = $scope.id;
        var paramCategory = $scope.category;
        console.log("var1: " + var1 + " var2: " + var2 + " var3: " + var3 + " id: " + id + " paramCategory:" + paramCategory);

        $.ajax({
            url: "/wikiUpdate",
            data: {var1: var1, var2: var2, var3: var3, id: id, paramCategory: paramCategory},
            type: 'POST',
            cache: false,
            contentType: "application/x-www-form-urlencoded",
            success: (data) => {
                console.log("update ajax success");
                console.log(JSON.parse(data));
            },
            error: function (error) {
                console.log("update ajax error");
                console.log(error);
            }
        });
    }

    $scope.updateOrdering = (id, ordering) => {
        $.ajax({
            url: "/wikiUpdate",
            data: {var1: ordering, id: id, paramCategory: "ordering", var2: $scope.id},
            type: 'POST',
            cache: false,
            contentType: "application/x-www-form-urlencoded",
            success: (data) => {
                console.log("ordering ajax success");
                console.log(JSON.parse(data));
            },
            error: function (error) {
                console.log("ordering ajax error");
                console.log(error);
            }
        });
    }

    $scope.rearrange = (direction, ordering) => {
        console.log(direction + " " + ordering);
        var tempArr = $scope.principalObj;
        var index = ordering - 1;
        var temp1 = tempArr[index];
        if(direction == "up"){
            if(null != tempArr[index - 1]){
                console.log("Switching " + tempArr[index].primary_name + "("+tempArr[index].ordering+") and " + tempArr[index-1].primary_name + "("+tempArr[index-1].ordering+")");

                tempArr[index] = tempArr[index-1];
                tempArr[index-1] = temp1;
                tempArr[index].ordering = ordering;
                tempArr[index-1].ordering = ordering-1;

                $scope.updateOrdering(tempArr[index].nconst, tempArr[index].ordering);
                $scope.updateOrdering(tempArr[index-1].nconst, tempArr[index-1].ordering);

                console.log("At end: " + tempArr[index].primary_name + "("+tempArr[index].ordering+") and " + tempArr[index-1].primary_name + "("+tempArr[index-1].ordering+")");
            }
        }else{
            if(null != tempArr[index + 1]){
                console.log("Switching " + tempArr[index].primary_name + "("+tempArr[index].ordering+") and " + tempArr[index+1].primary_name + "("+tempArr[index+1].ordering+")");
                tempArr[index] = tempArr[index+1];
                tempArr[index+1] = temp1;
                tempArr[index].ordering = ordering;
                tempArr[index+1].ordering = ordering+1;

                $scope.updateOrdering(tempArr[index].nconst, tempArr[index].ordering);
                $scope.updateOrdering(tempArr[index+1].nconst, tempArr[index+1].ordering);
                console.log("At end: " + tempArr[index].primary_name + "("+tempArr[index].ordering+") and " + tempArr[index+1].primary_name + "("+tempArr[index+1].ordering+")");
            }
        }
        $scope.principalObj = tempArr;
        console.log($scope.principalObj);
    }

    $scope.editPage = () => {
        $scope.edit = true;
        console.log("here");
    }

    $scope.submitChanges = () => {
        $scope.edit = false;
        if($scope.category == "Title"){
            $scope.updateTitle();
        }else{
            $scope.updatePerson();
        }
    }
});