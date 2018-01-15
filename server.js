const express = require('express')
const app = module.exports = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
const path = require('path')

app.set('view engine', 'pug')
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
    socket.on('disconnect', function() {
        console.log('user disconnected')
    })
})

server.listen(8081,function(){ // Listens to port 8081
    console.log('Listening on ' + server.address().port);
})