const express = require('express')
const app = express()
const playlistModel= require("./playlist_model")
const port= 5000
app.listen(port)

const mongoose = require('mongoose');
const { title } = require('process');
mongoose.connect("mongodb://localhost/book")
const db = mongoose.connection 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() { 
  console.log('connection success'); 
});

const songSchema= mongoose.Schema({
	  title :String,
    artist: String,
    genre :String,
    duration:String

},{timestamps:true})

const songModel= mongoose.model("songs", songSchema);

app.post("/songCreate",express.urlencoded({extended:true}),async(req,res)=>{
   let {title, artist,genre,duration}= req.body;
   const songSave = await new songModel({
   title: title,
   artist:artist,
   genre:genre,
   duration:duration
   })
   
   res.send(await songSave.save())
});

app.get("/songFind",express.urlencoded({extended:true}),async(req,res)=>{
    try {
        const { title, sort } = req.body;
        //jika titlenya kosong masuk findAll, jika sebaliknya masuknya kefindby title
            if(!title){
                const songsF= await songModel.aggregate([
                  {
                    $project:{
                      title:1, artist:1, genre:1, duration:1
                    }
                  },
                  {
                    $sort:{
                      title:parseInt(sort)
                    }
                  },
                ])
                res.send(songsF) 
            }else{
                const findSong= await songModel.aggregate([
                  {
                    $match:{
                      title:title
                    }
                  }
                ])
                res.send(findSong)
            }
            
        } catch (err) {
          res.send({ message: err.message || "Internal Server Error" });
        }
});
    
//untuk melakukan updateing pada data di data base
app.put("/songUpdate",express.urlencoded({extended:true}), async (req, res) => {
    try {
    const { id } = req.body;
    const { title,artist,genre,duration } = req.body;
    const Uptsong= await songModel.findByIdAndUpdate(id, {
            title: title,
            artist:artist,
            genre:genre,
            duration:duration
    }, {
        new:true
    })
      res.send(Uptsong)
    } catch (err) {
      res.send({ message: err.message || "Internal Server Error" });
    }
  });

app.delete("/songDelete/:id",express.urlencoded({extended:true}), async (req, res) => {
    try {
    const { id } = req.body;
    const deleteSong= await songModel.findByIdAndDelete(id)
      res.send(deleteSong)
    } catch (err) {
      res.send({ message: err.message || "Internal Server Error" });
    }
  });

app.get("/songAgg",express.urlencoded({extended:true}),async(req,res)=>{
  try{
    let {sort,genre,page, limit}= req.body;
    page = parseInt(page)-1
    limit= parseInt(limit)
    if(page <0){
      page=0
    }
    if (!sort){
      const SongData= await songModel.aggregate([
        {
          $sort:{
            title:1
          }
        },
        {
          $skip: page*limit
        },
        {
          $limit:limit
        },
        {
          $project:{
            title:1, artist:1, genre:1, duration:1
          }
        },
      ])
      res.send({page:`${page+1}/${Math.ceil(await songModel.count()/limit)}`, SongData})
    }else{
      //sort harus disi terlebih dahulu
      const SongData= await songModel.aggregate([
        {
          $facet:{
            songList:[
              {
                $match:{
                  genre:genre
                }
              },
              
              {
                $sort:{
                  title:parseInt(sort)}
              }
            ],
            info_Genre:[
              {
                $group:{
                  _id:"$genre",
                  count:{$sum:1}
                }
              }
            ]
          }
        }
      ])
      res.send(SongData)
    }
    
  }catch(err){
    res.send({message: err.message || "Internal Server Error"});
  }
})

//membuat CRUD untuk playlist
app.post("/playlistCreate",express.urlencoded({extended:true}), async (req, res)=>{
  try{
    let {title, song_list,} =req.body;
    let songId=song_list.split(" ")
    let PlaylistAr=[]

    songId.forEach((book)=>{
      PlaylistAr.push({
        song_id: mongoose.Types.ObjectId(book)
      }) 
    })

    const dataList= new playlistModel({
      title,
      song_list:PlaylistAr
    })
    console.log(dataList)
    await dataList.save()
    res.send(dataList)

  }catch(err){
    res.send({ message: err.message || "Internal Server Error" });
  }
})

app.get("/playlistRead",express.urlencoded({extended:true}), async (req, res)=>{
  try{
    let {title}= req.body
    let
    if(!title){
      const playfind= await playlistModel.aggregate([
        {
          $project:{
            title:1,artist:1, song_list:1
          }
        }
      ])
      res.send(playfind)
    }else{
      const playfind= await playlistModel.aggregate([
        {
         $match:{
         title:title
         }
        },
        {
          $facet:{
            info:[
              {
                $group:{
                  _id:"$title",
                  count:{$sum:1}
                }
              }
            ]
          }
        }
      ])
      res.send(playfind)
    }
  }catch(err){
    res.send({ message: err.message || "Internal Server Error" });
  }
})
//belum jadi
app.patch("/playlistUpdate", express.urlencoded({extended:true}),async(req,res)=>{
  try{
    const { id } = req.body;
    let {title, song_list} = req.body
    song_list=song_list.split(" ").map(el => mongoose.Types.ObjectId(el))
    let song_ids=[]
    song_list.forEach((song)=>{
      song_ids.push({
        song_id:song
      })
    })
    const updateplay= await playlistModel.findByIdAndUpdate(id, {
            title: title,
            song_list :song_ids
    },{new :true})
      res.send(updateplay)
  } catch (err) {
    res.send({ message: err.message || "Internal Server Error" });
  }
})

app.delete("/PlayListdelete/:id",express.urlencoded({extended:true}), async (req, res) => {
  try {
  const { id } = req.body;
  const deleteData= await playlistModel.findByIdAndDelete(id)
    res.send(deleteData)
  } catch (err) {
    res.send({ message: err.message || "Internal Server Error" });
  }
});

app.get("/playlookup",express.urlencoded({extended:true}), async(req,res)=>{
  try{
    let {sort, page, limit}=req.body
    page = parseInt(page)-1
    limit= parseInt(limit)
    if(page <0){
      page=0
    }
    const playLookup= await playlistModel.aggregate([
      {
        $skip:page*limit
      },
      {
        $limit:limit
      },
      {
        $lookup:{
          from:"songs",
          localField:"song_list.song_id",
          foreignField:"_id",
          as:"Play_populet"
        }
      },
      {
        $sort:{
          title:parseInt(sort)
        }
      },
      
    ])
    res.send({page:`${page+1}/${Math.ceil(await playlistModel.count()/limit)}`, playLookup})
  }catch(err){
    res.send({ message: err.message || "Internal Server Error" });
  }
})



