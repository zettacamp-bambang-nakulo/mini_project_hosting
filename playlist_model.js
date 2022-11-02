const { default: mongoose } = require("mongoose");

const playlist = mongoose.Schema({
    title: String,
    song_list: [{
      _id:false,
      song_id:{
        type: mongoose.Schema.Types.ObjectId
      },
    }],
  },{timestamps:true});

const playlistModel= mongoose.model("playlists",playlist)
module.exports= playlistModel;