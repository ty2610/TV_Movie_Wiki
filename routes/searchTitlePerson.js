var express = require('express');
var path = require('path');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

router.post('/', function(req, res, next) {
    var dbURL;

    if (process.env.NODE_ENV === 'tyler') {
        dbURL = "/Users/tyler.green/Desktop/imdb.sqlite3";
    } else if (process.env.NODE_ENV === 'nick') {
        //put path to local DB here
        dbURL = "C:\\Users\\ntscheel\\Documents\\imdb.sqlite3";
    } else if (process.env.NODE_ENV === 'production') {
        dbURL = "imdb.sqlite3";
    }
    var db = new sqlite3.Database(dbURL);

    var category = req.body.category;
    var searchText = req.body.searchText;
    var titleType = req.body.titleType;
    var roleType = req.body.roleType;

    searchText = searchText.replace(/[\[\]();]/g, "");
    searchText = searchText.replace(/[*]/g, "%");

    var query = "";
    if(category === "Title") {
        query = "SELECT * FROM Titles WHERE primary_title LIKE '" + searchText + "'";
        if(titleType !== undefined) {
            query += " AND title_type LIKE " + "'" + titleType + "'"
        }
        //I WOULD APPEND ANOTHER part to the where SOMETHING LIKE THIS
        //AND title_type LIKE "titleType"
    } else if (category === "People") {
        query = "SELECT * FROM Names WHERE primary_name LIKE '" + searchText + "'";
        if(roleType !== undefined) {
            query += " AND primary_profession LIKE " + "'%" + roleType + "%'";
        }
    } else {
        res.send("Incorrect category provided.");
    }

    db.all(query, (err, result) => {
        console.log(JSON.stringify(result));
        var data = JSON.stringify(result);
        res.send(data);
        db.close();
    });
});

module.exports = router;