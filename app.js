var io = require('socket.io')(process.env.PORT||5000);
var shortid = require('shortid');
var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');

var db = require('./config/database');

//gets id of warning for Mongoose
mongoose.Promise = global.Promise;

//connect to mongodb using mongoose 
mongoose.connect(db.mongoURI, {
    useMongoClient:true
}).then(function(){
    console.log("Connected to the Monogo Database")
}).catch(function(err){
    console.log(err)
});

//Load  in Models
require('./models/Users');
require('./models/Players');
var Users = mongoose.model('Users');
var Players = mongoose.model('Players');


var players = [];

console.log("Server Running");

io.on('connection', function(socket){
    console.log("Connected to Unity"); 
    socket.emit('connected');
    var thisPlayerId = shortid.generate();

    var player = {
        id:thisPlayerId,
        score:0,
        position:{
            v:0
            
        }
    }
    
    players[thisPlayerId] = player;
    socket.emit('register', {id:thisPlayerId});
    socket.broadcast.emit("spawn", {id:thisPlayerId});
    socket.broadcast.emit('requestPosition');
    socket.broadcast.emit('requestScore');
    

    for(var playerID in players){
        if(playerID == thisPlayerId)
        continue;
        socket.emit('spawn', players[playerID]);
        
        var newPlayer = {
            name:playerID,
            score:0
        }
        new Players(newPlayer).save().then(function(play){
            console.log("Sending data to database");
            
        });
    }

    socket.on('sendData', function(data){
        console.log(JSON.stringify(data));
        var newUser = {
            name:data.name
        }
        new Users(newUser).save().then(function(users){
            console.log("Sending data to database");
            Users.find({}).then(function(users){
                console.log(users);
                socket.emit('hideform', {users});
            });
            
        });
    });

    socket.on('sayhello', function(data){
        console.log("Unity Game says hello");
        socket.emit('talkback');
    });

    socket.on('disconnect', function(){
        console.log("Player Disconnected");
        delete players[thisPlayerId];
        socket.broadcast.emit('disconnected', {id:thisPlayerId});
    });

    socket.on('move', function(data){
        data.id = thisPlayerId;
        //console.log("Player Moved", JSON.stringify(data));
        socket.broadcast.emit('move', data);
    });
    
    socket.on('updatePosition', function(data){
        
        data.id = thisPlayerId;
        socket.broadcast.emit('updateScore', data);
        socket.broadcast.emit('updatePosition', data);
    });

    socket.on('updateScore', function(data){
        console.log( JSON.stringify(data));
        socket.broadcast.emit('updateScore', data);
        
        Players.find({}).then(function(play){
            play.score = data.score
            console.log(play);
        });

    });
});