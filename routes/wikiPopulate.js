var express = require('express');
var path = require('path');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

router.post('/', function(req, res, next) {
    var dbURL;

    if (process.env.NODE_ENV === 'tyler') {
        dbURL = "/Users/tyler.green/Desktop/imdb.sqlite3";
    } else if (process.env.NODE_ENV === 'nick') {
        dbURL = "C:\\Users\\ntscheel\\Documents\\imdb.sqlite3";
    } else if (process.env.NODE_ENV === 'production') {
        dbURL = "/../imdb.sqlite3";
    }
    var db = new sqlite3.Database(dbURL);

    var id = req.body.id;
    var paramCategory = req.body.paramCategory;
    var query  = "";
    if(paramCategory == "People"){
        query = "SELECT * FROM Names WHERE nconst = '" + id + "'";
    }else if(paramCategory == "Title"){
        query  = "SELECT * FROM Titles AS t " +
            "LEFT JOIN Ratings AS r ON t.tconst = r.tconst " +
            "WHERE t.tconst  = '" + id + "'";
    }else if(paramCategory == "Principals") {
        query = "SELECT p.ordering, p.nconst, p.category, p.job, p.characters, n.primary_name " +
            "FROM Principals AS p " +
            "LEFT JOIN Names as n ON p.nconst = n.nconst " +
            "WHERE p.tconst = '" + id + "' " +
            "ORDER BY p.ordering ASC";
    }else if(paramCategory == "getTitles") {
        query = "SELECT tconst, primary_title FROM Titles AS t WHERE t.tconst IN (";
        var titlesArr = id.split(',');
        for(var i = 0; i < titlesArr.length; i++){
            query += "'" + titlesArr[i] + "',";
        }
        query = query.slice(0,-1) + ")";
    }else{
        res.send("Incorrect category provided.");
    }
    db.all(query, (err, result) => {
        res.send(JSON.stringify(result));
        db.close();
    });

});

module.exports = router;