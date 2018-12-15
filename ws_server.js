const Game = require("./Game.js")
const session = require("express-session");
var sessionParser = session({
    secret: "null",
    resave: false,
    saveUninitialized: true
});

function Player(ws, name){
    this.ws = ws;
    this.name = name;
    this.state = "waiting";
    this.opponent = null;
}
Player.prototype.setOpponent = function(opp){
    this.opponent = opp;
    opp.opponent = this;
    this.state = "setup";
    opp.state = "setup";

    this.ws.send(JSON.stringify({
        action: "connect",
        opponent: opp.name
    }));
    opp.ws.send(JSON.stringify({
        action: "connect",
        opponent: this.name
    }));
}
Player.prototype.startGame = function(){
    this.opponent.state = this.state = "playing";
    this.ws.send(JSON.stringify({action:"start"}));
    this.opponent.ws.send(JSON.stringify({action:"start"}));
    this.interval = setInterval(function(){
        if(player.opponent.shot)
            player.board.hit(player.opponent.shot);
        if(player.shot)
            player.opponent.board.hit(player.shot);
        player.shot = player.opponent.shot = null;

        player.update();
        polayer.opponent.update();
    }, 5000)
}
Player.prototype.update = function(){
    this.ws.send(JSON.stringify({
        action: "move",
        shotsAtYou: this.board.shots,
        shotsAtThem: this.opponent.board.shots
    }))
}

var waitingPlayer = null;

function handleConnection(ws) {
    console.log("handleConnection called");
    var player;
    var opponent;
    var name = "TEST";

    player = new Player(ws, name);
    if(waitingPlayer)
    {
        console.log("connecting " + name + " to " + waitingPlayer.name);
        player.setOpponent(waitingPlayer);
        waitingPlayer = null;
    }else{
        waitingPlayer = player;
    }

    ws.on("close", function(){
        if(waitingPlayer && waitingPlayer.ws == ws){
            waitingPlayer = null;
        }
    })

    ws.on("message", function(msg){
        console.log("we got a message with: " + msg.utf8Data);
        data = JSON.parse(msg.utf8Data);
        if(opponent){
            console.log("player.state: " + player.state);
            if(player.state == "setup"){
                player.board = new Game.Board();
                // TODO: varify valid ships
                try{
                    data.ships.foreach((ship)=>{
                        board.addShip(ship.pos, ship.length, ship.vert, {})
                    });
                }catch(x){
                    ws.send(JSON.stringify({action:"error", msg:"invalid ship placement"}));
                    return;
                }
                if(opponent.board){
                    player.startGame();
                }
            }else if(player.state == "playing"){
                player.shot = data.shot;
            }
        }
    })
    console.log("connection setup");
}

function handleRequest(req){
    var id;
    console.log("we have a ws request...");
    req.on("requestAccepted", (ws)=>onsole.log("requestAccepted: " + id))
    sessionParser(req.httpRequest, {}, function(){
        if(req.httpRequest.session.user){
            id = req.httpRequest.session.user;
            req.accept(null, req.origin);
        }else{
            req.reject(403, "you are not logged in");
        }
        
    });
}

module.exports = {
  handleConnection: handleConnection,
  handleRequest: handleRequest
}