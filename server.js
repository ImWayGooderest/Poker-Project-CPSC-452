/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser");

function Player()
{
  this.session_key= 0;
  this.hand = [];
  this.score = 0;
}

var player1 = new Player();
var player2 = new Player();
// body-parser set up
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));




app.listen(3000, function() {
  "use strict";
  console.log("Poker Project app listening on port 3000!");
});


app.post("/sendKey", function (req,res) {
  console.log("POST /sendKey");
  console.log(req.body);
  res.sendStatus(200);
});

app.get("/getHand", function (req,res) {
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

app.post("/sendCard", function (req,res) {
  console.log("POST /sendCard");
  res.sendStatus(200);
});

app.get('/login', function (req, res){
  if(playerCount === 0){
    player1.session_key =
    playerCount++;
    console.log("Player " + playerCount +" logged in the game!");
  }
  else if (playerCount === 1)  {
    //req.mySession.username = 'Player 2';
    playerCount++;
    console.log("Player " + playerCount +" logged in the game!");
  } else {
    res.send("ERROR: Too many players!!!!")
  }

  res.sendStatus(200);
});

app.get('/logout', function (req, res) {
  //req.mySession.reset();
});