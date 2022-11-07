const mongoose = require('mongoose');
const bookModel= require("./book_Model")
const bookShelfModel= require("./bookshel_Model")
const Modeluser = require("./userModel")
const jwt = require("jsonwebtoken")

//penamaan variabel musti hati hati kapan perluh jamak dan tunggal
//contoh penamaan jika mengembalikan value yang banyak contoh books
async function getBooksall(parent,{page, limit}){
    if(page < 1 && limit <1 ){
        const book=await bookModel.find()
        return book
        
    }else{
        const book= await bookModel.aggregate([
            {
                $skip:page*limit
            },
            {
                $limit:limit
            },
        ])
        book.map((el)=>{
            el.id=mongoose.Types.ObjectId(el._id)
            return el
        })
        return book
    }
    
}

async function getBooksByid(parent,{id}){
    if(!id){
        const bookByid= await bookModel.find()
        return bookByid
    }else{
        const bookByid= await bookModel.findById(id)
        return bookByid
    }
}

//create date book new
async function createbook(parent,{title,author,date_publiched,price,stock}){
    let addbook= await new bookModel({
        title:title,
        author:author,
        date_publiched:date_publiched,
        price:price,
        stock:stock
    })
    addbook.save()
    return  addbook
}

async function updatebook(parent,{id,title,author,date_publiched,price,stock}){
    let bookupdate= await bookModel.findByIdAndUpdate(id,{
        title:title,
        author:author,
        date_publiched:date_publiched,
        price:price,
        stock:stock
    },{new:true})
    return bookupdate
    console.log(bookupdate)
}

async function deletebook(parent,{id}){
    let delbook= await bookModel.findByIdAndDelete(id)
    return delbook
    console.log(delbook)
}

async function calculator(parent,{discount,tax}){
    const countPrice= await bookModel.aggregate([
        {
            $addFields:{
                price_discount:{
                    $multiply:[discount/100,"$price"]
                },
                price_tax:{
                    $multiply:[tax/100,"$price"]
                }
            }
        },
        {
            $addFields:{
                total_price:{
                    $subtract:[{$sum:["$price","$price_tax"]},"$price_discount"]
                }
            }
        }
        
        
    ])
    countPrice.map((el)=>{
        el.id=mongoose.Types.ObjectId(el.id)
        return el
    })
    return countPrice
}

async function getBookShelfs(){
    const bookshelfs= await bookShelfModel.find()
    return bookshelfs
}

async function getbooklistid(parent,args, context){
    if(parent.list_id){
        // console.log(await context.bookloders.load(parent,created_by))
        // console.log(parent)
    return await context.bookloders.load(parent.list_id)
    }
    
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


async function auth(parent, {token}){
    let status;
    const tokenCheck = jwt.decode(token)
    const getUser = tokenCheck.username;
    const getPass = tokenCheck.password;
    const getSecret = tokenCheck.secret;
    
    //console.log(tokenCheck)
    
    
    if(getUser == activeUser.username && getPass == activeUser.password){
    
    jwt.verify(token, getSecret, (err) => {
    
    if (err){
    return status = err;
    }
    activeUser.active = true;
    status = "Behasil Login";
    })
    }else{
    status = "Cek kembali username dan password anda";
    }
    return {status}
    }
    


module.exports={
    Query:{
        getBooksall,
        getBooksByid,
        getBookShelfs,
        login,
        auth



    },
    Mutation:{
        createbook,
        updatebook,
        deletebook,
        calculator
    },
    BookShelf_bookids:{
        list_id: getbooklistid
    },

        

};