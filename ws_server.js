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
    console.log("startGame called");
    this.opponent.state = this.state = "playing";
    this.ws.send(JSON.stringify({action:"start"}));
    this.opponent.ws.send(JSON.stringify({action:"start"}));
    this.interval = setInterval(()=>{
        if(this.opponent.shot)
            this.board.hit(this.opponent.shot);
        if(this.shot)
            this.opponent.board.hit(this.shot);
        this.shot = this.opponent.shot = null;

        this.update();
        this.opponent.update();
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
        var data = JSON.parse(msg.utf8Data);
        if(player.opponent){
            console.log("player.state: " + player.state);
            if(player.state === "setup"){
                player.board = new Game.Board();
                // TODO: varify valid ships
                try{
                    for(var i = 0; i < data.ships.length; i++){
                        var ship = data.ships[i];
                        player.board.addShip(ship.pos, ship.length, ship.vert, {})
                    }
                }catch(x){
                    ws.send(JSON.stringify({action:"error", msg:"invalid ship placement"}));
                    return;
                }
                if(player.opponent.board){
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
    req.on("requestAccepted", function(ws){
        ws.user = id;
    })
    sessionParser(req.httpRequest, {}, function(){
        if(req.httpRequest.session.user){
            id = req.httpRequest.session.user;
            req.accept(null, req.origin);
        }else{
            req.reject(403, "you are not logged in");
        }
        
    });
}

function handleRequest_(req){
    req.accept(null, req.origin);
}

module.exports = {
  handleConnection: handleConnection,
  handleRequest: handleRequest_
}