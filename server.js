var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  ursa = require("ursa");

function Player()
{
  this.session_key= 0;//the key actually used for encryption
  this.session_key_base64=0;
  this.hand = [];
  this.card1 = ""; //It looks like the cards are saved as strings
  this.card2 = "";
  this.card3 = "";
  this.score = 0;
}
var player1 = new Player();
var player2 = new Player();
var round = 1; //what round it is

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
//input player card output new player hand
app.post("/sendCard", function (req,res) {
  console.log("POST /sendCard");
  var player = verify_user(req);
  var cardPlayed = req.body.card;
  if(player) {
    var index = player.hand.indexOf(cardPlayed);
    if(index > -1){ //if card exists in hand
      if(round == 1) {
        player.card1 = cardPlayed;
      } else if (round ==2) {
        player.card2 = cardPlayed;
      } else if (round ==3) {
        player.card3 = cardPlayed;
      } else {
        console.log("INVALID ROUND");
        res.status(200).json("INVALID ROUND")
      }
      player.hand.splice(index,1); //remove played card from hand
      res.status(200).send(encrypt(player.session_key, JSON.stringify(player.hand)))
    } else {
      console.log("INVALID CARD");
      res.status(200).json("INVALID CARD")
    }
  } else {
    console.log("INVALID PLAYER");
    res.send("ERROR: Invalid player")
  }
});

/*
app.post("/findWinner", function (req,res) {
	console.log("POST /sendCard");
	var player = verify_user(req);
	if(player) {
		player1Counter = 0;
		player2Counter = 0;
		draw = 0;
		
		//Check Card 1
		if (player1.card1 > player2.card1){
			player1Counter += 1;
		}
		else if (player1.card1 < player2.card1){
			player2Counter += 1;
		}
		else if (player1.card1 == player2.card1){
			draw += 1;
		}
		
		//Check Card 2
		if (player1.card2 > player2.card2){
			player1Counter += 1;
		}
		else if (player1.card2 < player2.card2){
			player2Counter += 1;
		}
		else if (player1.card2 == player2.card2){
			draw += 1;
		}
		
		//Check Card 3
		if (player1.card3 > player2.card3){
			player1Counter += 1;
		}
		else if (player1.card3 < player2.card3){
			player2Counter += 1;
		}
		else if (player1.card3 == player2.card3){
			draw += 1;
		}
		
		
		//Find Winner
		if (player1Counter > player2Counter) {
			winner = Player_1;
		}
		else if (player1Counter < player2Counter) {
			winner = Player_2;
		}
		else if (player1Counter == player2Counter) {
			winner = Draw;
		}
	} else {
		res.send("ERROR: Invalid player")
    }
	 res.status(200).json(encrypt(winner));
})
*/

function verify_user(req) {
  var playerNumber = 0;
  if(player1.session_key_base64 === req.body.session_key_base64) {
    playerNumber = player1;
  } else if(player2.session_key_base64 === req.body.session_key_base64) {
    playerNumber = player2;
  }
  return playerNumber;
}

function encrypt(public_key, data) {
  var key = ursa.createPublicKey(public_key);
  return key.encrypt(data,"utf8","base64");
}


//input is session key, output is player's hand
app.post('/login', function (req, res){
  if(player1.session_key === 0) {
    player1.session_key_base64 = req.body.session_key_base64;
    player1.session_key = new Buffer(req.body.session_key_base64, 'base64').toString("ascii");
    player1.hand = generateHand();
    console.log("Player 1 logged in the game!");
    res.status(200).send(encrypt(player1.session_key,JSON.stringify(player1.hand)));
  }
  else if (player2.session_key === 0) {
    player2.session_key_base64 = req.body.session_key_base64;
    player2.session_key = new Buffer(req.body.session_key_base64, 'base64').toString("ascii");
    player2.hand = generateHand();
    console.log("Player 2 logged in the game!");
    res.status(200).send(encrypt(player2.session_key,JSON.stringify(player2.hand)));
  } else {
    res.send("ERROR: Too many players!!!!")
  }
});

app.get('/logout', function (req, res) {
  //req.mySession.reset();
});