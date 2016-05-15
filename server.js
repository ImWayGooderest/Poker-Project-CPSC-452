/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser");

function Player()
{
  this.session_key= 0;//the key actually used for encryption
  this.session_key_base64=0;
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


function generateHand(handsize) {
  handsize = handsize || 3; //if no handsize default to 3
  var hand = [];
  for (var i = 0; i<handsize; i++) {
    hand.push(Math.floor(Math.random() * 15 + 1));
  }
  return hand;
}


//NOT TESTED
app.post("/sendCard", function (req,res) {
  console.log("POST /sendCard");
  var player = verify_user(req);
  if(player) {
    //removed req.card from player.hand and say ok or maybe send back the new hand
  } else {
    res.send("ERROR: Invalid player")
  }
  res.sendStatus(200);
});

//NOT TESTED
function verify_user(req) {
  var playerNumber = 0;
  if(player1.session_key_base64 === req.body.session_key_base64) {
    playerNumber = player1;
  } else if(player2.session_key_base64 === req.body.session_key_base64) {
    playerNumber = player2;
  }
  return playerNumber;
}


//input is session key, output is player's hand
app.post('/login', function (req, res){
  if(player1.session_key === 0) {
    player1.session_key_base64 = req.body.session_key_base64;
    player1.session_key = new Buffer(req.body.session_key_base64, 'base64').toString("ascii");
    player1.hand = generateHand();
    console.log("Player 1 logged in the game!");
    res.json(player1.hand);
  }
  else if (player2.session_key === 0) {
    player2.session_key_base64 = req.body.session_key_base64;
    player2.session_key = new Buffer(req.body.session_key_base64, 'base64').toString("ascii");
    player2.hand = generateHand();
    console.log("Player 2 logged in the game!");
    res.json(player2.hand)
  } else {
    res.send("ERROR: Too many players!!!!")
  }
});

app.get('/logout', function (req, res) {
  //req.mySession.reset();
});