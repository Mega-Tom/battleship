const GRID_SIZE = 10

function Coordinate(x,y){
    if(x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) throw "Out of bounds";
    this.x = x;
    this.y = y;
}

Coordinate.prototype.valueOf = function(){
    this.x + this.y * GRID_SIZE;
}

function Board(){
    this.grid = [];
    this.shots = [];
    for(var i = 0; i < GRID_SIZE; i++) {
        this.grid[i] = [];
        this.shots[i] = [];
        for(var j = 0; j < GRID_SIZE; j++) {
            this.grid[i][j] = 0;
            this.shots[i][j] = false;
        }
    }
    this.shipInfo = [{}];
}

Board.prototype.get = function(c){
    return this.shipInfo[this.grid[c.y][c.x]];
}

Board.prototype.addShip = function (pos, len, vert, shipData) {
    var coordinates = [];
    for(var i = 0; i < len; i++) 
    {
        var x = vert ? pos.x : pos.x + i;
        var y = vert ? pos.y + i : pos.y;
        coordinates.push(new Coordinate(x, y));
        if(this.grid[y][x]) throw "Overlapping Ship";
    }
    var id = this.shipInfo.length;
    this.shipInfo.push(shipData);
    this.shipInfo[id].location = coordinates;
    for(var i = 0; i < coordinates.length; i++){
        this.grid[coordinates[i].y][coordinates[i].x] = id;
    }
}

Board.prototype.canAddShip = function (pos, len, vert) {
    for(var i = 0; i < len; i++) 
    {
        var x = vert ? pos.x : pos.x + i;
        var y = vert ? pos.y + i : pos.y;
        if(x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return false;
        if(this.grid[y][x].ship) return false;
    }
    return true;
}

Board.prototype.hit = function (pos) {
    this.shots[pos.y][pos.x] = this.grid[pos.y][pos.x] ? "hit" : "miss";
}

Board.prototype.isAllClear = function() {
   for(var i = 0; i < GRID_SIZE; i++) {
        for(var j = 0; j < GRID_SIZE; j++) {
            if(this.grid[i][j] && !this.shots[i][j]) return false;
        }
    }
    return true;
}

module.exports = {
    Coordinate: Coordinate,
    Board: Board
}