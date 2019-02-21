var io = require('socket.io')(process.env.PORT||5000);
var shortid = require('shortid');

var players = [];
var playerCount = 0;

console.log("Server Running");

io.on('connection', function(socket){
    console.log("Connected to Unity"); 
    var thisPlayerId = shortid.generate();

    var player = {
        id:thisPlayerId,
        position:{
            v:0
            
        }
    }
    
    players[thisPlayerId] = player;
    socket.broadcast.emit("spawn", {id:thisPlayerId});
    console.log("Sending spawn to new with ID ", thisPlayerId);

    for(var i = 0; i < players.length; i++){
        
        socket.emit('spawn');

    }

    socket.on('sayhello', function(data){
        console.log("Unity Game says hello");
        socket.emit('talkback');
    });

    socket.on('disconnect', function(){
        console.log("Player Disconnected");
        playerCount--;
    });

    socket.on('move', function(data){
        data.id = thisPlayerId;
        console.log("Player Moved", JSON.stringify(data));
        socket.broadcast.emit('move', data);
    })
});