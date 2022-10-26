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
app.post("/books",express.urlencoded({extended:true}),async(req,res)=>{
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
app.put("/booksup/:id",express.urlencoded({extended:true}), async (req, res) => {
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
  
app.delete("/booksdel/:id",express.urlencoded({extended:true}), async (req, res) => {
    try {
    const { id } = req.body;
    const deleteData= await Books.findByIdAndDelete(id)
      res.send(deleteData)
    } catch (err) {
      res.send({ message: err.message || "Internal Server Error" });
    }
  });


  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
         //mongodb day 3 bikin list dengan memasukan id dari book kemarin dan menggunkan CRUD
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//

const bookShelfS = mongoose.Schema({
  title: String,
  book_ids: [{
    _id:false,
    list_id:{
      type: mongoose.Schema.Types.ObjectId
    },
    added:{
      type: Date,
      default: new Date
    },
    stock:{ 
      type:Number
    }
  }],
  date:[{
    date:{
      type: Date
    },
    time:{
      type: String
    }

  }]
},{timestamps:true});

const bookShelfModel= mongoose.model("bookShelf", bookShelfS);

app.post("/bookshelf/:id",express.urlencoded({extended:true}), async (req, res)=>{
  try{
    let {title,book_ids,added,stock,date, time}= req.body;
    let book_idArr= book_ids.split(" ")
    let stockArr = stock.split(' ').map((el) => {return parseInt(el)});
    let BookArr=[]
    
    book_idArr.forEach((book,index)=>{
      BookArr.push({
        list_id: mongoose.Types.ObjectId(book),
        stock:stockArr[index],
        added: new Date(added)
      })
    })
    // book_ids=BookArr;
    const DataShelf = new bookShelfModel({
      title,
      book_ids:BookArr,
  
      date:[{
        date:new Date,
        time: time
      }],
      
    })
    // console.log(added)
    await DataShelf.save()
    res.send(DataShelf)
  }catch(err){
    res.send({ message: err.message || "Internal Server Error" });
  }
})
//operator adalah membandingkan nilai dengan yang ditentutkan agar hasinya sesuai dengan yang ditentutkan
//filter untuk memilah data sesuai dengan agumen yang ditentukan
// mencari data _id dari isi book_ids
//$eq( equal) operator mencocokkan dokumen di mana nilai bidang sama dengan nilai yang ditentukan.
//$gt (greater than) Mencocokkan nilai yang lebih besar dari nilai yang ditentukan.
// $gte(greater than or equal )
// Mencocokkan nilai yang lebih besar atau sama dengan nilai yang ditentukan.
// $in( in an array)
// Cocok dengan salah satu nilai yang ditentukan dalam larik.
// $lt( less than)
// Mencocokkan nilai yang kurang dari nilai yang ditentukan.
// $lte( less than or equal)
// Mencocokkan nilai yang kurang dari atau sama dengan nilai yang ditentukan.
// $ne(not equal)
// Mencocokkan semua nilai yang tidak sama dengan nilai yang ditentukan.
// $nin(none of the values specified in an array)
// Tidak ada yang cocok dengan nilai yang ditentukan.
//$elemMatch mencocokkan lebih dari satu komponen dalam elemen array.

app.get("/bookshelfby/:id",express.urlencoded({extended:true}),async(req,res)=>{
  try {
      const { _id } = req.body;
      let ids=[]
      
      //jika titlenya kosong masuk findAll, jika sebaliknya masuknya kefindby title
      //! adalah note
          if(!_id){
              res.send(await bookShelfModel.find({}))
          }else{
              ids = _id.split(" ")
              const findData1= await bookShelfModel.find({
                book_ids:{ 
                $all: ids
              
              }
        
              })
              res.send(findData1)
          }
          
      } catch (err) {
        res.send({ message: err.message || "Internal Server Error" });
      }
    });

app.get("/bookshelfbys/:id",express.urlencoded({extended:true}),async(req,res)=>{
      try {
          const { _id } = req.body
          //jika titlenya kosong masuk findAll, jika sebaliknya masuknya kefindby title
          //! adalah note
              if(!_id){
                  res.send(await bookShelfModel.find({}))
              }else{
                  const findData1= await bookShelfModel.find({
                    $elemMatch:{ 
                    $eq: book_ids(_id)
                  
                  }
            
                  })
                  res.send(findData1)
              }
              
          } catch (err) {
            res.send({ message: err.message || "Internal Server Error" });
          }
        });

//buat update data dari bookshelf dimana dapat menambah isi dari book_ids atau dapat juga menguranginya
app.patch("/bookshelfup/:id",express.urlencoded({extended:true}), async (req, res) => {
    try {
    const { id } = req.body;
    const {title, book_ids  } = req.body;
    const updateBookS= await  bookShelfModel.findByIdAndUpdate(id, {
            title: title,
            book_ids : book_ids.split(" ")
    },{ new :true
    })
      res.send(updateBookS)
    } catch (err) {
      res.send({ message: err.message || "Internal Server Error" });
    }
  });
  
  
  app.delete("/bookshelfdel/:id",express.urlencoded({extended:true}), async (req, res) => {
    try {
    const { id } = req.body;
    const deleteData= await bookShelfModel.findByIdAndDelete(id)
      res.send(deleteData)
    } catch (err) {
      res.send({ message: err.message || "Internal Server Error" });
    }
  });