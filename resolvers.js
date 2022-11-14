//import monggose dari libery
const mongoose = require('mongoose');

//import user model
const userModel= require("./userModel")

//import apollo error
const { ApolloError } = require('apollo-server-errors')

//import jwt
const jwt= require("jsonwebtoken");

//impor bcrypt
const bcrypt= require("bcrypt")

//untuk create

//untuk Read data
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
    // let generalPermit =[
    //     {
    //         name:"Menu",
    //         view:true
    //     },
    //     {
    //         name:"Profile",
    //         view:true
    //     },
    //     {
    //         name:"Cart",
    //         view:true
    //     },
 
    // ]
    // let usertype=[];
    // if(role ==="user"){
    //     usertype.push(
    //         ...generalPermit,
    //         {
    //             name: "Menu Management",
    //             view: false
    //         },
    //         {
    //             name: "Stock Management",
    //                 view: false
    //         }
    //     )
        
    // }else if(role === "admin"){
    //     usertype.push(
    //         ...generalPermit,
    //         {
    //             name: "Menu Management",
    //             view: true
    //         },
    //         {
    //             name: "Stock Management",
    //             view: true
    //         }
    //     )
    // }
    password = await bcrypt.hash(password, 5)
    let addUser= await new userModel({
        email:email,
        first_name:first_name,
        last_name:last_name,
        password:password,
        // usertype:usertype
    })
    addUser.save()
    return addUser
}

//untuk update data user
async function UpdateUser(parent,{id,email,first_name,last_name,password,status}){
    password = await bcrypt.hash(password, 5)
    console.log(password)
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
async function login(parent,{email, password}){
    let checkUser= await userModel.findOne({email:email});
    password= await bcrypt.compare(password, checkUser.password)
    console.log(password)
    if(!checkUser ){
        throw new ApolloError("user tidak ditemukan")
    }
    if(password){
        const token = generateAccessToken({id:checkUser._id, email:email})
        return {token:token}
    }else{
        throw new ApolloError("cek kembali password ada yang salah")
    }
}


const Userresolvers={
    Query:{
        getAllUser,
        getOneUser,
       
    },
    Mutation:{
        login,
        CreateUser,
        UpdateUser,
        DeleteUser
    }
}

module.exports= Userresolvers