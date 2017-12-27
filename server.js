var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

//app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/css', express.static(__dirname + '/css'))

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(socket) {
    console.log('oioioioioioi')
    socket.on('disconnect', function() {
        console.log('user disconnected')
    })
})

server.listen(8081,function(){ // Listens to port 8081
    console.log('Listening on ' + server.address().port);
})
