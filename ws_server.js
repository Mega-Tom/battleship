const Game = require("./Game.js")

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
    var interval = setInterval(function(){
        player.board.hit(player.opponent.shot);
        player.opponent.board.hit(player.shot);
        player.shot = player.opponent.shot = null;
        player.update();
        polayer.opponent.update();
    }, 5000)
}
Player.prototype.update = function(){
    this.ws.send(JSON.stringify({
        action: "move",
        yourShips: this.board.grid,
        shotsAtYou: this.board.shots,
        shotsAtThem: this.opponent.board.shots
    }))
}

var waitingPlayer = null;

function handleConnection(ws) {
    var player;
    var opponent;

    player = new Player(ws, name);
    if(waitingPlayer)
    {
        player.setOpponent(waitingPlayer);
        waitingPlayer = null;
    }else{
        waitingPlayer = player;
    }

    ws.on("close", function(){
        if(waitingPlayer.ws == ws){
            waitingPlayer = null;
        }
    })

    ws.on("message", function(data){
        console.log("we got a message with: " + data);
            data = JSON.parse(data);
        if(opponent){
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
}

module.exports = {
  handleConnection: handleConnection
}