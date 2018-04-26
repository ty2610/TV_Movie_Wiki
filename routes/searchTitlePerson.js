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
        dbURL = "/../imdb.sqlite3";
    }
    var db = new sqlite3.Database(dbURL);

    var category = req.body.category;
    var searchText = req.body.searchText;

    searchText = searchText.replace(/[\[\]();]/g, "");
    searchText = searchText.replace(/[*]/g, "%");

    var query = "";
    if(category === "Title") {
        query = "SELECT * FROM Titles WHERE primary_title LIKE '" + searchText + "'";
    } else if (category === "People") {
        query = "SELECT * FROM Names WHERE primary_name LIKE '" + searchText + "'";
    } else {
        res.send("Incorrect category provided.");
    }

    db.all(query, (err, result) => {
        console.log(JSON.stringify(result));
        res.send(JSON.stringify(result));
        db.close();
    });
});

module.exports = router;