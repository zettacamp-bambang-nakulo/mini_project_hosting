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
   const count = await userModel.count()
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
    data: dataUser,
    count:count,
    page: page,
    max_page:  Math.ceil( count / limit),
    
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
        const checkUser =await userModel.find({_id:mongoose.Types.ObjectId(id)})
        return checkUser

    }if(email) {
        const checkEmail= await userModel.find({email:email})
        if(checkEmail.length < 1){
            throw new ApolloError("email not found")
        }

        return checkEmail
    }
}

// untuk create user
async function CreateUser(parent,{email,first_name,last_name,password,role="user"}){
    const checkemail = await userModel.findOne({email:email})
    if(checkemail){
        throw new ApolloError("email been used")
    }
    let generalPermit= [
        {
            name:"Menu highlight & Special offer",
            slug:"menu_offer",
            icon_name:"local_offer",
            view:true
        },
        {
            name:"Menu",
            slug:"menu-page",
            icon_name:"restaurant-menu",
            view: true
        },
        {
            name:"About",
            slug:"about-page",
            icon_name:"info",
            view: false

        }
    ]
    let usertype=[];
    if(role === "admin"){
        usertype.push(
            ...generalPermit,
            {
                name: "Menu Management",
                slug:"menu-management",
                icon_name:"restaurant-menu",
                view: true
            },
            {
                name: "Stock Management",
                slug:"stock-management",
                icon_name:"list",
                view: true
            },
            {
                name:"Cart",
                slug:"cart-page",
                icon_name:"shopping-cart",
                view:false
            },
            {
                name:"History",
                slug:"history-page",
                icon_name:"history",
                view:true
            }
        )
    }else if(role ==="user"){
        usertype.push(
            ...generalPermit,
            {
                name: "Menu Management",
                slug:"menu-management",
                icon_name:"restaurant-menu",
                view: false
            },
            {
                name: "Stock Management",
                slug:"stock-management",
                icon_name:"list",
                view: false
            },
            {
                name:"Cart",
                slug:"cart-page",
                icon_name:"shopping-cart",
                view:true
            },
            {
                name:"History",
                slug:"history-page",
                icon_name:"history",
                view:true
            }
        )
    }
    password = await bcrypt.hash(password, 5)
    let addUser= await new userModel({
        email:email,
        first_name:first_name,
        last_name:last_name,
        password:password,
        role:role,
        usertype:usertype
    })
    if(addUser.role ==="admin"){
        saldo:0
    }
    if(!addUser){
        throw new ApolloError("must be filled")
    }
    
    addUser.save()
    return addUser
}

async function ForgetPassword(parent,{email,password},context){
    const checkEmail = await userModel.findOne({email:email})
    // console.log(checkEmail)
    if(checkEmail){
        password = await bcrypt.hash(password, 5)
        return await userModel.findByIdAndUpdate(checkEmail._id,{password:password})
    }else{
        throw new ApolloError("email not found")
    }
}

//untuk update data user
async function UpdateUser(parent,{id,email,first_name,last_name,password,status}){
    password = await bcrypt.hash(password, 5)
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
    return jwt.sign(payload, "zetta",{expiresIn:"1d"})
}

//login user dan mendapatkan token
async function login(parent,{email, password}){
    let checkUser= await userModel.findOne({email:email});
    if(!checkUser ){
        throw new ApolloError("user not found or wrong email")
    }
    password= await bcrypt.compare(password, checkUser.password)
    if(password){
        const token = generateAccessToken({id:checkUser._id, email:email, role:checkUser.role})
        return {token:token,
                id:checkUser._id,
                email:email,
                first_name:checkUser.first_name,
                last_name:checkUser.last_name,
                password:checkUser.password,
                role:checkUser.role,
                status: checkUser.status,
                usertype:checkUser.usertype

        }
    }else{
        throw new ApolloError("check again email and password there is something wrong")
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
        ForgetPassword,
        UpdateUser,
        DeleteUser
    }
}

module.exports= Userresolvers