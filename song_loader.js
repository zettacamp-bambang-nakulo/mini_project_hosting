const DataLoader= require("dataloader")
const songModel= require("./songModel")

const loadSong= async function(song_id){
    const songID= await songModel.find({
        _id:{
            $in:song_id
        }
    })

    const songMap={}
    songID.forEach((list)=>{
        songMap[list._id]=list
    })
    return song_id.map(id => songMap[id])
}

const loadersong= new DataLoader(loadSong)
module.exports= loadersong