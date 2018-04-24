var express = require('express');
var path = require('path');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var dbURL;
//var bodyParser = require('body-parser');

if (process.env.NODE_ENV === 'tyler') {
    dbURL = "/Users/tyler.green/Desktop/imdb.sqlite3";
} else if (process.env.NODE_ENV === 'nick') {
    //put path to local DB here
    dbURL = "";
} else if (process.env.NODE_ENV === 'production') {
    dbURL = "/../imdb.sqlite3";
}

var db = new sqlite3.Database(dbURL);

/* template/test route */
router.post('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    var category = req.body.category;
    var searchText = req.body.searchText;
    var query = "";
    if(category === "Title") {
        query = "SELECT * FROM "
    } else if (category === "Person") {

    } else {

    }
    /*db.all("SELECT * FROM Crew LIMIT 20", (err, result) => {
        res.send(JSON.stringify(result));
    });*/
});

module.exports = router;