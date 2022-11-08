const mongoose = require('mongoose');

const songSchema= mongoose.Schema({
    title :String,
    artist: String,
    genre :String,
    duration:String

})

const songModel= mongoose.model("songs", songSchema);
module.exports=songModel;