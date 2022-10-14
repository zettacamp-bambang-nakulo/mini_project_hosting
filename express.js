const express = require('express')
const app = express()
const port= 8000
const book = {
    title: "onepice"
    ,author:"ODA"
    ,deskripsi:"I want to be the pirate king"
    ,price: "Rp. 31000"
    ,discon:"5%"
    ,tax:"10%"
    ,sale: true
    ,stock:"6"
    ,jumlah:"6"

}


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

// app.use((req,res)=>{
//     res.send("halaman tidak ditemukan")
// })

