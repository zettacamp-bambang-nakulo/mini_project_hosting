const mongoose = require('mongoose');
const userModel= require("./userModel")
const ingModel= require("./ingredients/ingredientsModel")
const { ApolloError } = require('apollo-server-errors')
const jwt= require("jsonwebtoken");

//untuk create

//untuk Read data
async function getAllUser(parent,{email,first_name,last_name}){
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
   let dataUser = await userModel.find()
   return dataUser
   }

   let dataUser = await userModel.aggregate(queryAgg)
   return dataUser
}

   //jika kondisi semuanya terisi akan diproses dengan menggunakan pipline match
   //yang ada pada filter aggregate
   //unshift buat naruh match diatas


async function getOneUser(parent,{id, email}){
    // if(!id && !email){
    //     const user= await userModel.find()
    //     return user
    // } 
    if(id){
        const user =await userModel.find({_id:mongoose.Types.ObjectId(id)})
        console.log(user)
        return user

    }else{
        const user= await userModel.find({
            email:email
        })
        console.log(user)
        return user
    }
}

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

async function DeleteUser(parent,{id,email,first_name,last_name,password,status}){
    let delUser= await userModel.findByIdAndUpdate(id,{
        email:email,
        first_name:first_name,
        last_name:last_name,
        password:password,
        status:status
    },{new:true, runValidators:true})
    return delUser
}

function generateAccessToken(payload){
    return jwt.sign(payload, "zetta",{expiresIn:"1h"})
}

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

//-------------------------------------------collection ingredients-----------------------------------------------------//
async function CreateIngredints(parent,{name,stock}){
    let addIngredint = await new ingModel({
        name:name,
        stock:stock
    })
    addIngredint.save()
    return addIngredint
}

module.exports={
    Query:{
        getAllUser,
        getOneUser,
        login
    },
    Mutation:{
        CreateUser,
        UpdateUser,
        DeleteUser,
        CreateIngredints
    }
}