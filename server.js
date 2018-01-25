const express = require('express')
const app = module.exports = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
const path = require('path')

var playerList = []
var Player = function(startX, startY, startR) {
    this.x = startX
    this.y = startY
    this.r = startR
}

//app.set('view engine', 'pug')
//app.use('/css',express.static(__dirname + '/css'));
//app.set('views', express.static(__dirname))
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/css', express.static(__dirname + '/css'))

app.get('/', (req,res) => {
    res.sendFile(__dirname+'/views/index.html');
});

io.on('connection', function(socket) {
    console.log('user connected...id: ' + socket.id)
    

    socket.on('new player', function(data) {
        var newPlayer = new Player(data.x, data.y, data.r)
        console.log('new player w/ id: ' + this.id)
        
        
        newPlayer.id = this.id

        //info to be sent to all clients except sender
        var current_info = {
            id: newPlayer.id,
            x: newPlayer.x,
            y: newPlayer.y,
            r: newPlayer.r
        }

        //send to the new player about everone who is already connected
        for (i=0; i < playerList.length; i++) {
            existingPlayer = playerList[i]
            var player_info = {
                id: existingPlayer.id,
                x: existingPlayer.x,
                y: existingPlayer.y,
                r: existingPlayer.r,
            }

            //send message to the sender-client only
            socket.emit('new_enemyPlayer', player_info)
        }

        playerList.push(newPlayer)
        console.log(playerList)

        //send message to every connected client except sender
        socket.broadcast.emit('new_enemyPlayer', current_info)

        socket.on('disconnect', onClientDisconnect)
    })

    socket.on('player update', function(data) {
        var current_info = {
            id: this.id,
            x: data.x,
            y: data.y,
            r: data.r
        }
        socket.broadcast.emit('player update', current_info)
        //console.log('data id: ' + data.x)
    })    
})

//send message to client every 3s
// setInterval(function() {
//     io.emit('test', 'test words')
//     console.log('sending test')
// }, 10000)

function onClientDisconnect() {
    var removePlayer = findPlayerID(this.id)
    if (removePlayer) {
        playerList.splice(playerList.indexOf(removePlayer), 1)
    }
    console.log('removing player: ' + this.id)

    this.broadcast.emit('remove player', {id: this.id})
}
function findPlayerID(id) {
    for (var i = 0; i < playerList.length; i++) {
        if (playerList[i].id == id) {
            return playerList[i]
        }
    }
    return false
}

server.listen(8081,function(){ // Listens to port 8081
    console.log('Listening on ' + server.address().port);
})