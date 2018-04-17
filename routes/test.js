var express = require('express');
var path = require('path');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/Users/tyler.green/Desktop/imdb.sqlite3');

/* template/test route */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    db.all("SELECT * FROM Crew LIMIT 20", (err, result) => {
        res.send(JSON.stringify(result));
    });
});

module.exports = router;