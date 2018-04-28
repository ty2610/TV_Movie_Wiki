var express = require('express');
var path = require('path');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var dbURL;

if (process.env.NODE_ENV === 'tyler') {
    dbURL = "/Users/tyler.green/Desktop/imdb.sqlite3";
} else if (process.env.NODE_ENV === 'nick') {
    //put path to local DB here
    dbURL = "";
} else if (process.env.NODE_ENV === 'production') {
    dbURL = "imdb.sqlite3";
}

var db = new sqlite3.Database(dbURL);

router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    /*db.all("SELECT * FROM Crew LIMIT 20", (err, result) => {
        res.send(JSON.stringify(result));
    });*/
    var holder = path.resolve('views/resultPage.html');
    //res.setHeader("Content-Type", "text/html");
    //res.redirect(holder);
    res.sendFile(holder);
    //res.sendFile(path.resolve('views/index.html'));
});

module.exports = router;