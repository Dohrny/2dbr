var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

//for phaser stuff plz work
server.lastPlayerID = 0

//app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/css', express.static(__dirname + '/css'))

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(socket) {
    console.log('user connected...id: ' + socket.id)
    socket.on('disconnect', function() {
        console.log('user disconnected')
        //start chaos
        socket.player = {
            id: server.lastPlayerID++,
            x: randomInt(50, 1200),
            y: randomInt(50, 1200)
        }
        socket.emit('allplayers', getAllPlayers())
        socket.broadcast.emit('newplayer', socket.player)
        //end chaos
    })
})

server.listen(8081,function(){ // Listens to port 8081
    console.log('Listening on ' + server.address().port);
})

//more chaos
function getAllPlayers() {
    var players = []
    Object.keys(io.sockets.connected).forEach(function(socketID) {
        var player = io.sockets.connected[socketID].player
        if (player) players.push(player)
    })
    return players
}

function randomINT (low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}
