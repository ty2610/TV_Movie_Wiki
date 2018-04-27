var express = require('express');
var path = require('path');
var router = express.Router();
var poster = require('../imdb_poster');

router.post('/', function(req, res, next) {

    var category = req.body.category;
    var id = req.body.id;
    if(category === "Title") {
        poster.GetPosterFromTitleId(id, (error, data) => {
            if(!error) {
                if (req.body.increment !== undefined) {
                    data.increment = req.body.increment;
                    res.send(data);
                } else {
                    res.send(data);
                }
            } else {
                res.send("error");
            }
        });
    } else if (category === "People") {
        poster.GetPosterFromNameId(id, (error, data) => {
            if(!error) {
                if (req.body.increment !== undefined) {
                    data.increment = req.body.increment;
                    res.send(data);
                } else {
                    res.send(data);
                }
            } else {
                res.send("error");
            }
        });
    } else {
        res.send("Incorrect category provided.");
    }
});

module.exports = router;