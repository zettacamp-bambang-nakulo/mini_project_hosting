const mongoose = require('mongoose');
const songModel= require("./songModel")
const playlistModel= require("./playlist_model");
const { title } = require('process');
const Modeluser= require("./userModel")
const jwt= require("jsonwebtoken");
const { ApolloError } = require('apollo-server-errors');
const { isConstructorDeclaration } = require('typescript');

async function getsongs(parent,{page, limit},context){
    // console.log(context.req.headers.authorization)
    if(page<1 && limit <1){
        const songs= await songModel.aggregate([
            {
                $project:{
                    title:1,artist:1,genre:1, duration:1
                }
            }
        ])
        songs.map((el)=>{
            el.id = mongoose.Types.ObjectId(el._id)
            return el
        })
        return songs
    }else{
        const token = context.req.headers.authorization || ""
        if(!token){
            throw new ApolloError("kamu tidak terauthorisasi")
        }
        jwt.verify(token,"zetta", function(err,decode){
            if(err){
                throw new ApolloError(err)
            }
        })
        const count = await songModel.count()
        let datasongs= await songModel.aggregate([
            {
                $skip:(page-1)*limit
            },
            {
                $limit:limit
            }
        ])
        datasongs.map((el)=>{
            el.id = mongoose.Types.ObjectId(el._id)
            return el
        })
      
        datasongs = {
            data: datasongs,
            count:count,
            page: page,
            max_page:  Math.ceil( count / limit),
            
        };
          return datasongs
          console.log(datasongs)
    }
 
}

function auth(context){
    const token = context.req.headers.authorization || ""
        if(!token){
            throw new ApolloError("kamu tidak terauthorisasi")
        }
        jwt.verify(token,"zetta", function(err,decode){
            if(err){
                throw new ApolloError(err)
            }
            return true
        })
}
async function getsongsByid(parent,{id},context){
    auth(context)
    if(!id){
        const songByid= await songModel.find()
        return songByid
    }else{
        const songByid= await songModel.findById(id)
        return songByid
    }
}

async function createSong(parent,{title,artist,genre,duration},context){
    auth(context)
    let addSong= await new songModel({
        title:title,
        artist:artist,
        genre:genre,
        duration:duration
    })
    addSong.save()
    return addSong
}

async function updateSong(parent,{id,title,artist,genre,duration},context){
    auth(context)
    let songUpdate= await songModel.findByIdAndUpdate(id,{
        title:title,
        artist:artist,
        genre:genre,
        duration:duration
    },{new:true})
    return songUpdate
}

async function deleteSong(parent,{id},context){
    auth(context)
    let delSong= await songModel.findByIdAndDelete(id)
    return delSong
}

async function getplaylist(parent,args,context){
    auth(context)
    const playlists= await playlistModel.find()
    return playlists
}

async function getsonglistid(parent,args,context){
    auth(context)
    if(parent.song_id){
        return await context.songloders.load(parent.song_id)
    }
}

async function getplaylistId(parent,{id},context){
    auth(context)
    if(!id){
        const playlists= await playlistModel.find()
        return playlists
    }else{
        const playlists= await playlistModel.findById(id)
        console.log(playlists)
        return playlists
    }
}

async function createplaylist(parent,{title,song_list},context){
    auth(context)
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
    await dataList.save()
    return dataList
}

async function updateplaylist(parent,{id, title, song_list},context){
    auth(context)
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
      return updateplay
}

async function deleteplaylist(parent,{id},context){
    auth(context)
    const deleteData= await playlistModel.findByIdAndDelete(id)
    return deleteData
}

async function getUsers(parent,args,context){
    auth(context)
    const users= await Modeluser.find()
    return users
}

async function register(parent,{username, password}){
    const userRegis= await new Modeluser({
        username:username,
        password:password
    })
    userRegis.save()
    return userRegis
}

function generateAccessToken(payload){
    return jwt.sign(payload, "zetta",{expiresIn:"1h"})
}

async function login(parent,{username, password, secret},context){
    let userCheck= await Modeluser.find({username:username});
    let status;
    activeUser= userCheck[0]

    if(userCheck.length < 1){
        return{status: "${username} tidak ditemukan"}
    }

    if(activeUser.username==username && activeUser.password== password){
        const token = generateAccessToken({username:username, password:password,secret:secret})
        return{status:token}
    }else{
        return{status:"cek kembali password ada yang salah"}
    }
}

// async function auth(parent, {token},context){
//     let status;
//     token = context.req.headers.Authorization
//     const tokenCheck = jwt.decode(token)
//     const getUser = tokenCheck.username;
//     const getPass = tokenCheck.password;
//     const getSecret = tokenCheck.secret;
    
//     //console.log(tokenCheck)
    
    
//     if(getUser == activeUser.username && getPass == activeUser.password){
    
//     jwt.verify(token, getSecret, (err) => {
    
//     if (err){
//     return status = err;
//     }
//     activeUser.active = true;
//     status = "Behasil Login";
//     })
//     }else{
//     status = "Cek kembali username dan password anda";
//     }
//     return {status}
//     }
    

module.exports={
    Query:{
        getsongs,
        getsongsByid,
        getplaylist,
        getplaylistId,
        getUsers,
        login,

        
    },
    Mutation:{
        createSong,
        updateSong,
        deleteSong,
        createplaylist,
        updateplaylist,
        deleteplaylist,
        register
    },
    list_id:{
        song_id: getsonglistid
    }
}