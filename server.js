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
var round = 1,//what round it is
  roundCounter = 0; //when both players have played a card for a round roundCounter == 2

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
        res.status(500).send(encrypt(player.session_key, JSON.stringify({err: "INVALID ROUND"})));

      }
      player.hand.splice(index,1); //remove played card from hand
      res.status(200).send(encrypt(player.session_key, JSON.stringify({hand: player.hand, msg: checkWinner(player)})))
    } else {
      console.log("INVALID CARD");
      res.status(500).send(encrypt(player.session_key, JSON.stringify({err: "INVALID CARD"})));

    }
  } else {
    console.log("INVALID PLAYER");
    res.status(500).json({err:"INVALID PLAYER"});
  }
});

app.post("/checkForWInner", function (req,res) {
  console.log("POST /checkForWinner");
  var player = verify_user(req);
  if(player) {
    res.status(200).send(encrypt(player.session_key, JSON.stringify({msg: checkWinner(player)})))
  } else {
    console.log("INVALID PLAYER");
    res.status(500).json({err:"INVALID PLAYER"});
  }
});


function incrementRound() {
  roundCounter += 1;
  if (roundCounter >= 2) {
    round += 1;
    roundCounter = 0;
  }
}
function checkWinner(player) {
  var winner;
  if (round == 1 && player1.card1 > 0 && player2.card1 > 0) {
    winner = getWinner(player1.card1, player2.card1)
  } else if (round == 2 && player1.card2 > 0 && player2.card2 > 0) {
    winner = getWinner(player1.card2, player2.card2)
  } else if (round == 3 && player1.card3 > 0 && player2.card3 > 0) {
    winner = getWinner(player1.card3, player2.card3)
  } else { //both players haven't played a card
    return 0
  }
  if(winner == 0) {// 0 means tie
    incrementRound();
    return "You Tied"
  } else if(winner.session_key_base64 == player.session_key_base64) {
    incrementRound();
    player.score += 1;
    return "You Won The Round"
  } else{
    incrementRound();
    return "You Lose The Round"
  }
}

function getWinner(player1Card, player2Card) {
  if(player1Card > player2Card) {
    player1.score += 1;
    return player1
  } else if (player1Card < player2Card) {
    player2.score += 1;
    return player2
  } else { //need to figure out what to do with ties
    return 0
  }
}

app.get("/gameWinner", function (req, res) {
  if (player1.score == player2.score){
    res.json({end: 'Tie Game' });
  }
  else if (player1.score > player2.score){
    res.json({end: 'Player 1 Wins' });
  }
  else {
    res.json({end: 'Player 2 Wins' });
  }
});


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
    res.status(500).send(encrypt(player.session_key, JSON.stringify({err: "INVALID ROUND"})));

  }
});

app.get('/logout', function (req, res) {
  console.log("GOT IT");
  delete player1;
  delete player2;
  player1 = new Player();
  player2 = new Player();
  round = 1;
  res.sendStatus(200)
});
