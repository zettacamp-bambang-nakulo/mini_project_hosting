//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
                                        //Mongodb DAY 2
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//
//Mongoose adalah sebuah module pada NodeJS yang di install menggunakan npm, 
//berfungsi sebagai penghubung antara NodeJS dan database nosql MongoDB.
//Ada beberapa schema type yang didukung oleh pustaka ini yaitu
// String
// Number
// Date
// Boolean
// Buffer (untuk data binary misalnya gambar, mp3 dll.)
// Mixed (data dengan tipe apa saja)
// Array
// ObjectId

const { timeStamp } = require('console');
const express = require('express')
const app = express()
const port= 4000
app.listen(port)

const mongoose = require('mongoose');

const { title } = require('process');

//connection menggunkan syingkronus
//erupakan sebuah url untuk mengakses database MongoDB.
// Dan yang mana url ini pun dapat di ubah jika kita memiliki data di luar sana selain MongoDB.
mongoose.connect("mongodb://localhost/book")
const db = mongoose.connection 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() { 
  console.log('connection success'); 
});
//Schema merupakan mapping dari MongoDB collection dan definisi dari type data yang di gunakan pada setiap object dalam collection.
const bookSchema = mongoose.Schema({
    title: String,
    author: String,
    date_publiched: Number,
    price: Number,
    tanggal_dibuat: Date,
    tanggal_update: Date
},{timestamps:true})

//Sedangkan model merupakan sebuah konstruktor compiled yang berasal dari Schema yang sudah kita definisikan.
const Books= mongoose.model("Books", bookSchema);


// const book1= new Books({
//     title:"Bokuno Hero",
//     author:" Midoriyama",
//     date_publiched:2019,
//     price: 20000,
//     tanggal_dibuat: new Date(),
//     tanggal_update: new Date(),
// })

// console.log(book1)

app.get("/data",(req,res)=>{
    res.send(book1)
})
//root api buat membaca data atau mencari
app.get("/find",express.urlencoded({extended:true}),async(req,res)=>{
    try {
        const { title } = req.body;
        //jika titlenya kosong masuk findAll, jika sebaliknya masuknya kefindby title
            if(title== null || title==undefined){
                const findAll= await Books.find()
                res.send(findAll)
            
            }else{
                const findData= await Books.find({
                    title:title,
                })
                res.send(findData)
            }
            
        } catch (err) {
          res.send({ message: err.message || "Internal Server Error" });
        }
      });
    
    


// untuk membuat atau creat data pada database mongodb
app.post("/create",express.urlencoded({extended:true}),async(req,res)=>{
   let {title, author,date_publiched,price}= req.body;
   const save = await new Books({
    title: title,
    author: author,
    date_publiched: date_publiched,
    price: price,
   })
   
   res.send(await save.save())
})

//untuk melakukan updateing pada data di data base
app.put("/update",express.urlencoded({extended:true}), async (req, res) => {
    try {
    const { id } = req.body;
    const { title, author, date_publiched, price } = req.body;
    const updateData= await Books.findByIdAndUpdate(id, {
            title: title,
            author: author,
            date_publiched: date_publiched,
            price: price,
    }, {
        new:true
    })
      res.send(updateData)
    } catch (err) {
      res.send({ message: err.message || "Internal Server Error" });
    }
  });
  
app.delete("/delete1",express.urlencoded({extended:true}), async (req, res) => {
    try {
    const { id } = req.body;
    const deleteData= await Books.findByIdAndDelete(id)
      res.send(deleteData)
    } catch (err) {
      res.send({ message: err.message || "Internal Server Error" });
    }
  });

