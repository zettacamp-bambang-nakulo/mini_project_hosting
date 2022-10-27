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
    stock: Number,
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
    const { title, author, date_publiched, price,stock } = req.body;
    const updateData= await Books.findByIdAndUpdate(id, {
            title: title,
            author: author,
            date_publiched: date_publiched,
            price: price,
            stock: stock
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
    let {title,book_ids,added,stock, time}= req.body;
    let book_idArr= book_ids.split(" ") //buat mengasih spasi pada book_ids di posmant biar bisa input id banyak
    let stockArr = stock.split(" ").map((el) => {return parseInt(el)});//map array brfungsi untuk mengubah ulang data split menjadi init atau angka
    let BookArr=[] //buat menampung array objek
    

    //foreach adalah perulangan khusu untuk membaca nilai array
    //push untuk memasukan data
    //book dan index parameter yang udah ada pada forEach
    //mongoose.Types.ObjectId untuk mendefisinikan objek id
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
                    book_ids:{ 
                    $elemMatch: {
                        list_id: {$eq:mongoose.Types.ObjectId(_id)}
                    }
                  
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

//buat mengubah date luar 
  app.put("/bookshelf-date/:id",express.urlencoded({extended:true}), async (req, res) =>{
    let {id, date, new_date}= req.body;
    let check=null; //buat mengecek apakah data null atau kosong
    if(id){
      check = await bookShelfModel.updateOne({"_id":mongoose.Types.ObjectId(id)
    },{
      $set:{
        "date.$[dt].date":new Date(new_date)//untuk menargetkan dokumen atau filter sesuai dengan shecma
        //untuk mengfilter berdasarkan array tertentu
        //dt untuk menyimpan indek sesuai dengan parameter yang dikasih
      }
    },{
      arrayFilters:[{
        "dt.date":{
          $lte: Date(date)}
      }]
    })
    } else{
      res.send("id tidak ada")
    }
    res.send(check)
    console.log(check)
  })
//root buat mengubah data added yang ada dalam book_ids didalam list_id
// $filter
// Memilih subset array untuk dikembalikan berdasarkan kondisi yang ditentukan. 
// Mengembalikan array dengan hanya elemen-elemen yang cocok dengan kondisi. 
// Elemen yang dikembalikan dalam urutan aslinya
app.put("/bookshelf-added/:id",express.urlencoded({extended:true}), async (req, res) =>{
    let {id, added, new_date}= req.body;
    let check=null;
    if(id){
      check = await bookShelfModel.updateMany({"_id":mongoose.Types.ObjectId(id)
    },{
      $set:{
        "book_ids.$[dd].added":new Date(new_date)
      }
    },{
      arrayFilters:[{
        "dd.added":{
          $lte: Date(added)}
      }]
    })
    } else{
      res.send("id tidak ada")
    }
    res.send(check)
  })
  
  
  app.delete("/bookshelfdel/:id",express.urlencoded({extended:true}), async (req, res) => {
    try {
    const { id } = req.body;
    const deleteData= await bookShelfModel.findByIdAndDelete(id)
      res.send(deleteData)
    } catch (err) {
      res.send({ message: err.message || "Internal Server Error" });
    }
  });

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//
              // mongodb day 5 membuat anggregate menggunakan addFields, project, dan unwind//
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
// Operasi Agregasi
// Operasi agregasi memproses banyak dokumen dan mengembalikan hasil yang dihitung.
// dapat menggunakan operasi agregasi untuk:

// Kelompokkan nilai dari beberapa dokumen bersama-sama.

// melakukan operasi pada data yang dikelompokkan untuk mengembalikan satu hasil.

// Menganalisis perubahan data dari waktu ke waktu.

// Untuk melakukan operasi agregasi, Anda dapat menggunakan:

// Pipa agregasi
// , yang merupakan metode pilihan untuk melakukan agregasi.

// Metode agregasi tujuan tunggal
// , yang sederhana tetapi tidak memiliki kemampuan pipa agregasi.
// addFields menambahkan field baru yang belum pernah ada dalam dokumen
//$multiply berfungsi untuk melakukan perhitungan perkalian  
app.get("/bookaddfiled",async(req,res)=>{
  try {
    const AddF= await Books.aggregate([
      {
        $addFields:{
          total_price:{
            $multiply:[{$toInt:"$stock"},"$price"] //perintah untuk mengubah string menjadi intejer dalam fields total_price
          }
        }
      }
    ])
    res.send(AddF)
      
    } catch (err) {
      res.send({ message: err.message || "Internal Server Error" });
    }
});

//buat melakukan match sesuai dengan data yang kita masukan dalam req body
// project buat menampilkan data sesui dengan apa yang kita inginkan atau kondisikan
// angka satu sama dengan true
app.get("/booksProject",express.urlencoded({extended:true}),async(req,res)=>{
  try {
    const {title}= req.body
    if(title){
      const bookMa= await Books.aggregate([
        {
          $match:{
            title:title
          }
        }
      
      ])
      res.send(bookMa)
    } else{
      const bookPt= await Books.aggregate([
        {
          $project:{
            title:1, date_publiched:1
          }
        }
      ])
      res.send(bookPt)
    } 
    } catch (err) {
      res.send({ message: err.message || "Internal Server Error" });
    }
})

app.get("/bookshelfunwind",async(req,res)=>{
  try{
    const bookunW= await bookShelfModel.aggregate([
      {
        $unwind: "$book_ids"
      },
      {
        $project:{
          title:1, book_ids:1
        }
      }
    ])
    res.send(bookunW)
    console.log(bookunW)
  }catch(err) {
    res.send({ message: err.message || "Internal Server Error" });
  }
})

