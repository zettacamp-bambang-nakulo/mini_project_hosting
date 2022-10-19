const { rejects } = require('assert')
const express = require('express')
const { resolve } = require('path')
const app = express()
const port= 8000
const creditbook=require("./app")
const book = require("./app")


app.listen(port)



function checkauth (req,res, next){
    //get the authorization header that was sent by the client
    const auth = req.headers.authorization
    console.log(auth);


    if(!auth){
        res.send("Error tidak dapat authorization")
        res.end()
        
    }

    let authori= new Buffer.from (auth.split(" ")[1], "base64").toString().split(":");
    let user= authori[0];
    let pass= authori[1];

    if (user == "zettacamp" && pass == "1234567"){
        //if authorized user
        next();
    } else {
       res.send("username and password wrong!")
       res.end()
        
    }

}

app.get("/" , checkauth, (req,res)=>{
    res.send("selamat datang")
    
    res.end()
}
)
app.get("/book",(req, res)=>{
    res.send(book)
    res.end()
})

app.get("/credit",async (req,res)=>{
    res.send( await creditbook())
})


// app.use("*",(req,res)=>{
//     res.send("halaman tidak ditemukan")
// })

//javascript day 6


// function  cobapromise(){
//     waktu=2000
//     return new Promise(()=>{
//         setTimeout(()=>{
//             diaplay= creditbook();
//             return diaplay
//         }, waktu)
//     })
   
// }

// async function cobaAsync(){
//     const coba= await cobapromise();
//     console.log(coba)
// }
// cobaAsync()


//javascrip day 7 ,2 point with await and witout awit and promesai and even js 

// read fs file salah satu dalam event, utf8 endcoding
//fs adalah libery yang berguna untuk membaca file, menulis file, membuat file, mengetahui kapasitas dan juga bisa menghapusnya
const fs =require("fs");
function readdata(){ 
    fs.readFile("data.txt","utf8",(err, data)=>{
    console.log(data)

})
};

//event adalah suatu tindakan dalam komputer  adalah event atau peristiwa untuk memangil fungsi
const event= require("events");
const { rsort } = require('semver')
async function event1(){ 
    const eventEmitter= new event.EventEmitter();
    eventEmitter.on("openfile",readdata)
    eventEmitter.emit("openfile")//openfile adalah nama event
}

//promise adalah mewakili penyelesaian akhir (atau kegagalan) dari operasi asinkron dan nilai yang dihasilkannya.
const Mypromise= new Promise((resolve,rejects)=>{
    resolve("hai")
    rejects("end")
})
Mypromise
    //then printah dari suatu proses keberhasilan 
    .then(() =>console.log("mengunggu data"))
    .catch(error => console.log("error"))


// root for with awit dengan try catch promise
app.get("/withawit",async(req, res)=>{
    try{
    await event1()
    res.send("with await")


    }catch(err){
        err = new Error("File tidak kebaca");
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        res.send({
        err : err.message
    })
    }

});

//root for no awit
app.get("/noawit",(req,res)=>{
    Mypromise
    .then(()=>{
        event1()
        res.send("this no await")
    })
    .catch((err)=>{
        console.log(err)
        res.end()
    })
    
})