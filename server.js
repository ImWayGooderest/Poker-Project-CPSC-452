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


app.post("/sendKey", jsonParser, function (req,res) {
  console.log("POST /sendKey");
  res.sendStatus(200);
});

app.get("/getHand", jsonParser, function (req,res) {
  var hand = generateHand();
  console.log("GET /getHand");
  console.log(hand);
  res.json(hand);
  res.sendStatus(200);
});

function generateHand(handsize) {
  handsize = handsize || 3; //if no handsize default to 3
  var hand = [];
  for (var i = 0; i<handsize; i++) {
    hand.push(Math.floor(Math.random() * 15 + 1));
  }
  return hand;
}

app.post("/sendCard", jsonParser, function (req,res) {
  console.log("POST /sendCard");
  res.sendStatus(200);
});