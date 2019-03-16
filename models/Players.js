var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    score:{
        type:Number,
        required: false
    },
    gamesPlayed:{
        type:Number,
        required:false
    }
});

mongoose.model('Players', PlayerSchema);