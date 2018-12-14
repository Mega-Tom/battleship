const GRID_SIZE = 10

function Coordinate(x,y){
    if(x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) throw "Out of bounds";
    this.x = x;
    this.y = y;
}

Coordinate.prototype.valueOf = function(){
    this.x + this.y * GRID_SIZE;
}

function ShipBoard(){
	this.grid = Array.from(Array(GRID_SIZE), () => Array.from(Array(GRID_SIZE), () => ({ship: false, hit: false})))
	ships = [];
} 
ShipBoard.prototype.addShip = function (pos, len, vert) {
    var coordinates = [];
    for(var i = 0; i < len; i++) 
    {
        var x = vert ? pos.x : pos.x + i;
        var y = vert ? pos.y + i : pos.y;
        coordinates.push(new Coordinate(x, y));
        if(this.grid[y][x].ship) throw "Overlapping Ship";
    }
    for(var i = 0; i < coordinates.length; i++){
        this.grid[coordinates[i].y][coordinates[i].x].ship = true;
    }
    this.ships.push({pos:pos, len:len, vert:vert});
}
ShipBoard.prototype.canAddShip = function (pos, len, vert) {
    for(var i = 0; i < len; i++) 
    {
        var x = vert ? pos.x : pos.x + i;
        var y = vert ? pos.y + i : pos.y;
        if(x < 1 || y < 1 || x > GRID_SIZE || y > GRID_SIZE) return false;
        if(this.grid[y][x].ship) return false;
    }
    return true;
}
ShipBoard.prototype.html = function(){
	var html = "<table class='board'><tbody>"
	for(var i = 0; i < 10; i++){ 
		html += "<tr>";
		for(var j = 0; j < 10; j++){
			html += "<td>"+ (this.grid[i][j].ship ? "#" : "~") +"</td>";
		}
		html += "</tr>";
	}
	html += "</tbody></table>"
	return html;
}

function PegBoard(){
	this.grid = Array.from(Array(10), () => new Array(10, false));
}

function displayBoard(board){
	$("#game").html(board.html);
}

$(function(){
    $("#findgame").click(function(){
        var ws = new WebSocket("wss://" + window.location.host + window.location.pathname + "connect");
        var oponent = null;
        var pBoard = null;
        var sBoard = null;
        ws.onmessage = function(event){
        	var data = JSON.parse(event.data)
        	if(data.action === "connect"){
        		oponent = data.oponent;
        		sBoard = new ShipBoard();
        		displayBoard(sBoard);

        	}
        	else if(data.action === "start"){
        		var table = $("<table>").class("board").appendTo($("#game"));
        		for(var i = 0; i < 10; i++){
        			var row = $("<tr>");
        			table.append(row);
        			for(var j = 0; j < 10; j++){
        				row.append($("<td>").id("cell" + i + "-" + j));
        			}
        		}
        		
        		
        		
        	}
        	else if(data.action === "move"){}
        }
    })
})

