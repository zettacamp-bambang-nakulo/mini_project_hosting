const express = require('express');
const { request } = require('http');
const app = express()
const port= 3000
app.listen(port)
//array objek fungsinya adalah membuat array dalam objek
const songs = [
    {
        title :"Interaksi",
        artist: "Tulus",
        genre :"Pop",
        duration:2.55
    },
    {
        title :"Butter",
        artist: "BTS",
        genre :"Kpop",
        duration:3.09
    },
    {
        title :"Terlukis Indah",
        artist: "Riski Febian",
        genre :"Pop",
        duration:3.59
    },
    {
        title :"Venom",
        artist: "Black Pink",
        genre :"Kpop",
        duration:3.14
    },
    {
        title :"Pesan Terakhir",
        artist: "Lyodra",
        genre :"Pop",
        duration:4.22
    },
    {
        title :"Pop!",
        artist: "Nayon",
        genre :"Kpop",
        duration:2.52
    },
    {
        title :"Hadapi Berdua",
        artist: "Tiara Andini",
        genre :"Pop",
        duration:3.56
    },
    {
        title :"The Feels",
        artist: "Twice",
        genre :"Kpop",
        duration:3.15
    },
    {
        title :"Bisa Tanpamu",
        artist: "Andmesh",
        genre :"Pop",
        duration:4.52
    },
    {
        title :"First Love",
        artist: "After School",
        genre :"Kpop",
        duration:3.40
    },
    {
        title :"Hati Lain Di Hatimu",
        artist: "Fabio Asher",
        genre :"Pop",
        duration:4.17
    },
    {
        title :"Copycat",
        artist: "Apink CHOBOM",
        genre :"Kpop",
        duration:4.05
    },
    {
        title :"Peri Cintaku",
        artist: "Ziva Magnolya",
        genre :"Pop",
        duration:4.53
    },
    {
        title :"Monochrome(Color)",
        artist: "ATBO",
        genre :"Kpop",
        duration:4.03
    },
    {
        title :"Tak Ingin Usai",
        artist: "Keisya Levronka",
        genre :"Pop",
        duration:4.33
    },
    {
        title :"Langit Favorit",
        artist: "Luthfi Aulia",
        genre :"Pop",
        duration:3.15
    },
    {
        title :"RUN",
        artist: "H1-Key.",
        genre :"Kpop",
        duration:3.44
    },
    {
        title :"Takut",
        artist: "Idgitaf",
        genre :"Pop",
        duration:5.10
    }
    ,
    {
        title :"lagu1",
        artist: "aku",
        genre :"Kpop",
        duration:3.40
    }
    ,
    {
        title :"lagu2",
        artist: "saya",
        genre :"Pop",
        duration:4.10
    },
    {
        title :"lagu3",
        artist: "Idgitaf",
        genre :"Pop",
        duration:4.23
    }
];

function sortByGenre(data, genre) {
    // bikin reference baru
    // biar nggak ada side effect
    
    // sort pake array method .sort()
    const sorted = data.filter(song => {
        // return boolean
        return song.genre == genre;
    });
    
    return sorted;
}

function sortByArtist(data, artist) {
    // bikin reference baru

    
    // sort pake array method .sort()
    const sorted = data.filter(song => {
        // return boolean
        return song.artist == artist;
    });
    
    return sorted;
}

function generateRandomPlaylist(data,min=60) {
    const songArray = [...data]
    // buat nampung output
    const output = {
        duration:0,
        playlist:[]
    };
    
    //Able to do iteration on array of object
    while(songArray.length > 0) {
        // random number
        const rnum = getRandomNumber(0, data.length  -1);
       
        // ngambil data dari array pake random 
        
        const song = songArray[rnum]
    
        songArray.splice(rnum, 1);
        
        // buat ngecek lagunya udah masuk playlist apa belum
        //Able to use condition statement
        if (!song) continue;
       
        
        // kalo setelah ditambah durasinya ternyata
        // lebih dari 60 menit. udah stop. kalo ngga ya lanjut
        if ((output.duration + song.duration) > min) break;
        
        // push song ke output.playlist
        output.playlist.push(song);
        
        // sama increment total durasinya.
        output.duration += song.duration;
        
    } 
    return output;
}

// helper buat dapetin angka random
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


//function dimasukan ke variable
// const genreSorted = sortByGenre(songs, "Pop");
// const artistSorted = sortByArtist(songs, "Tiara Andini");
// const randomPlaylist = generateRandomPlaylist(songs);

// //memangil function dalam console.log
// console.log("sorted genre:", genreSorted);
// console.log("sorted artist:", artistSorted);
// console.log("random playlist:", randomPlaylist);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
                                  // Final Javascript Day 9//
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//

// JSON Web Token adalah token berbentuk string panjang yang random,
// lalu token ini memungkinkan kita untuk mengirimkan data yang dapat diverifikasi oleh dua pihak atau lebih.

//kasih untuk parameter
//terima adalah kuci rahasia
//jwt.sign buat ambil tokennya
const jwt = require("jsonwebtoken");
function generateAccessToken(kasih){
    return jwt.sign(kasih,"terima",{expiresIn:"1h"});
}

const menerima= generateAccessToken({})
//untuk mengecek
//split buat memisahkan tokenya
function verifikasi(req,res,next){
    let token=req.headers.authorization;
    if(token===undefined){
        res.send("token tidak ada")
    }
    token=token.split(" ")[1]
    jwt.verify(token,"terima",(err, decode) =>{
        if(err){
            res.send(err)
        }else{
            next()
        }
    })
    
}

app.get("/",(req,res)=>{
    res.send("welcome to list song today")
});
app.post("/genrelist",verifikasi,express.urlencoded({extended:true}),(req,res)=>{
    const genre=req.body.genre;
    res.send(sortByGenre(songs,genre))
});

app.get("/artislist",verifikasi,express.urlencoded({extended:true}),(req,res)=>{
    const artis=req.body.artis;
    res.send(sortByArtist(songs,artis))
});

app.get("/randomlist",verifikasi,express.urlencoded({extended:true}),(req,res)=>{ 
    const durasi= req.body.durasi;
    res.send(generateRandomPlaylist(songs, durasi))
    
});


//---------------------------------------------------------------------------------------------------//
app.get("/token",express.urlencoded({extended:true}),(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    //call the function to generate and then return the token
    const menerima= generateAccessToken({username:username, password:password})
    res.send(menerima);
  });

app.get("/token/login",(req,res)=>{
    setTimeout(()=>{
        jwt.verify(menerima, "terima",(err, decode)=>{
            if(err){ 
                return res.send(err.message)
            }else (
                res.send("sukses login ygy")
                )
        })
    
    },1000)
})

