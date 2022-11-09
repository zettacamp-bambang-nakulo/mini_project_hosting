//import monggose dari libery
const mongoose = require('mongoose');

//import user model
const userModel= require("./userModel")

//import apollo error
const { ApolloError } = require('apollo-server-errors')

//import jwt
const jwt= require("jsonwebtoken");

//untuk create

//untuk Read data
//belum jadi paginationnya
async function getAllUser(parent,{email,first_name,last_name, page, limit}){
   let query ={$and:[]};
   let queryAgg= [];

   //kondisi untuk parameter, jika ada akan dipush ke dalam query dengan metod $and
   if(email){
    query.$and.push({
        email:email
    })
   }
   
   if(first_name){
    first_name= new RegExp(first_name,"i")
    query.$and.push({
        first_name:first_name
    })
   }
   
   if(last_name){
    last_name= new RegExp(last_name,"i")
    query.$and.push({
        last_name:last_name
    })
   }
   if(query.$and.length > 0){
    queryAgg.unshift(
        {
            $match:query
        },
    )
   }else{
    const count = await userModel.count()
    let dataUser = await userModel.aggregate([
        {
            $skip : (page-1)*limit
        },
        {
            $limit:limit
        }
   ])
   dataUser.map((el)=>{
    el.id = mongoose.Types.ObjectId(el._id)
        return el
   })
   dataUser = {
    data: dataUser,
    count:count,
    page: page,
    max_page:  Math.ceil( count / limit),
    
    };
   return dataUser
   }

   let dataUser = await userModel.aggregate(queryAgg,[
    {
        $skip : (page-1)*limit
    },
    {
        $limit:limit
    }
    
   ])
   dataUser.map((el)=>{
    el.id = mongoose.Types.ObjectId(el._id)
        return el
   })
   dataUser = {
    data: dataUser
    
    };
   return dataUser
}

   //jika kondisi semuanya terisi akan diproses dengan menggunakan pipline match
   //yang ada pada filter aggregate
   //unshift buat naruh match diatas


//untuk memanggil user berdasarkan id dan email
async function getOneUser(parent,{id, email}){
    // if(!id && !email){
    //     const user= await userModel.find()
    //     return user
    // } 
    if(id){
        const user =await userModel.find({_id:mongoose.Types.ObjectId(id)})
        return user

    }else{
        const user= await userModel.find({
            email:email
        })
        console.log(user)
        return user
    }
}

// untuk create user
async function CreateUser(parent,{email,first_name,last_name,password}){
    let addUser= await new userModel({
        email:email,
        first_name:first_name,
        last_name:last_name,
        password:password
    })
    addUser.save()
    return addUser
}

//untuk update data user
async function UpdateUser(parent,{id,email,first_name,last_name,password,status}){
    let changeUser= await userModel.findByIdAndUpdate(id,{
        email:email,
        first_name:first_name,
        last_name:last_name,
        password:password,
        status:status
    },{new:true})
    return changeUser
}

//untuk menghapus atau lebih untuk mengganti status dalam data user
async function DeleteUser(parent,{id,email,first_name,last_name,password,status}){
    let delUser= await userModel.findByIdAndUpdate(id,{
        email:email,
        first_name:first_name,
        last_name:last_name,
        password:password,
        status:status
    },{new:true})
    return delUser
}

//untuk generateAccessToken
function generateAccessToken(payload){
    return jwt.sign(payload, "zetta",{expiresIn:"1h"})
}

//login user dan mendapatkan token
async function login(parent,{email, password, secret}){
    let checkUser= await userModel.findOne({email:email});

    if(!checkUser ){
        throw new ApolloError("user tidak ditemukan")
    }
    if(checkUser.email==email && checkUser.password==password){
        const token = generateAccessToken({email:email, password:password,secret:secret})
        return {token:token}
    }else{
        throw new ApolloError("cek kembali password ada yang salah")
    }
}


const Userresolvers={
    Query:{
        getAllUser,
        getOneUser,
        login
    },
    Mutation:{
        CreateUser,
        UpdateUser,
        DeleteUser
    }
}

module.exports= Userresolvers