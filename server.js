/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser");
//body-parser set up
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});
// app.use(express.static(__dirname));


app.listen(3000, function() {
  "use strict";
  console.log("Poker Project app listening on port 3000!");
});


app.post("/receiveKey", jsonParser, function (req,res) {
  console.log("POST /receiveKey");
});

app.get("/dealHand", jsonParser, function (req,res) {
  console.log("GET /dealHand");
});

function generateHand() {

}

app.post("/receiveCard", jsonParser, function (req,res) {
  console.log("POST /receiveCard");
});



//old stuff below
// set up our routes
app.get("/links", urlencodedParser, function(req, res) {
  "use strict";
  var result = [];
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("GET /links");
    var cursor = db.collection("links").find();
    cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc !== null) {
        result.push(doc);
      } else {
        db.close();
        res.send(result);
      }
    });

  });

});
app.post("/links", jsonParser, function(req, res) {
  "use strict";
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("POST /links");
    db.collection("links").insertOne({
      "title": req.body.title,
      "link": req.body.link,
      "clicks": 0
    });
    db.close();
    res.sendStatus(204);
  });


});
app.get("/click/:title", urlencodedParser, function(req, res) {
  "use strict";
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("GET click/");
    var cursor = db.collection("links").find({
      "title": req.params.title
    });
    cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc !== null) {
        db.collection("links").update({title: req.params.title}, {$inc: {clicks: 1}});
        db.close();
        res.redirect(doc.link);
      }
    });
  });
});