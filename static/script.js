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
	this.ships = [];
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
        if(x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return false;
        if(this.grid[y][x].ship) return false;
    }
    return true;
}
ShipBoard.prototype.html = function(){
	var html = "<table class='board'><tbody>"
	for(var i = 0; i < 10; i++){ 
		html += "<tr>";
		for(var j = 0; j < 10; j++){
			html += this.grid[i][j].hit ? "<td class='hit'>" : "<td>";
			html += this.grid[i][j].ship ? "#" : "~";
			html += "</td>";
		}
		html += "</tr>";
	}
	html += "</tbody></table>"
	return html;
}

function PegBoard(){
	this.grid = Array.from(Array(GRID_SIZE), () => Array.from(Array(GRID_SIZE), () => ({hit: false})))
}

function displayBoard(board){
	//	$("#game").html(board.html());
	if(board.table){
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 10; j++){
				cell = $($(board.table.children()[i]).children()[j])
				if(board.grid[i][j].ship)
				{
					cell.addClass("ship");
				}
				if(board.grid[i][j].hit)
				{
					cell.addClass("hit");
				}
			}
		}

	}else{
		board.table = $("<table>").addClass("board").appendTo($("#game"));
		for(var i = 0; i < 10; i++){
			var row = $("<tr>");
			board.table.append(row);
			for(var j = 0; j < 10; j++){
				var cell = $("<td>").data({x: j, y: i});
				if(board.grid[i][j].ship)
				{
					cell.addClass("ship");
				}
				if(board.grid[i][j].hit)
				{
					cell.addClass("hit");
				}
				row.append(cell);
			}
		}

	}
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
        		$("#findgame").remove();

		        sBoard.table.find("td").click(function(){
		        	if(sBoard.canAddShip($(this).data(), 3, false))
	        		{
	        			sBoard.addShip($(this).data(), 3, false);
	        			displayBoard(sBoard);
	        		}else{
	        			alert("invalid ship location!");
	        		}
		        });

		        $("<button>").text("submit").appendTo($("#main")).click(function(){
		        	ws.send(JSON.stringify({ships: sBoard.ships}))
		        })
        	}
        	else if(data.action === "start"){
        		pBoard = new PegBoard();
        		displayBoard(pBoard);
        		

		        pBoard.table.find("td").click(function(){
		        	ws.send($(this).data());
		        });
        	}
        	else if(data.action === "move"){
				for(var i = 0; i < 10; i++){ 
					for(var j = 0; j < 10; j++){
        				pBoard.data[i][j].hit = data.shotsAtThem;
        				sBoard.data[i][j].hit = data.shotsAtUs;
		        		displayBoard(pBoard);
		        		displayBoard(sBoard);
        			}
        		}
        	}
        	else if(data.action === "error"){
        		alert(data.msg);
        	}
        }

    })
})

