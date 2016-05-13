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



