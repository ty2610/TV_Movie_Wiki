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

    var var1 = req.body.var1;
    var var2 = req.body.var2;
    var var3 = req.body.var3;
    var id   = req.body.id;

    console.log("var1: " + var1 + " var2: " + var2 + " var3: " + var3 + " id: " + id);
    var paramCategory = req.body.paramCategory;
    var query  = "";
    if(paramCategory == "People"){
        query = "UPDATE Names SET ";
        if(var1 != null){
            query += " birth_year = " + var1;
            if(var2 != "" || var3 != ""){query += ", ";}
        }
        if(var2 != ""){
            query += " death_year = " + var2;
            if(var3 != ""){query += ", ";}
        }
        if(var3 != ""){
            query += " primary_profession = '" + var3 + "'";
        }
        query += " WHERE nconst = '" + id + "'";
    }else if(paramCategory == "Title"){
        query = "UPDATE Titles SET ";
        if(var1 != null){
            query += " title_type = '" + var1 + "'";
            if(var2 != ""){query += ", ";}
        }
        if(var2 != ""){
            query += " genres = '" + var2 + "'";
        }
        query += " WHERE tconst = '" + id + "'";
    }else if(paramCategory == "ordering"){
        var titleID = req.body.titleID;
        query = "UPDATE Principals SET ordering = " + var2 + " WHERE nconst = '" + id + "' AND tconst = '"+titleID+"'; ";
        query += "UPDATE Principals SET ordering = " + var3 + " WHERE nconst = '" + var1 + "' AND tconst = '"+titleID+"'; ";
    }
    else{
        res.send("Incorrect category provided.");
    }

    db.all(query, (err, result) => {
        res.send(JSON.stringify(result));
        db.close();
    });

});

module.exports = router;