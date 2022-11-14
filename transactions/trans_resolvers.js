//import untuk apollo error
const { ApolloError } = require('apollo-server-errors')
//import mongoose
const mongoose= require("mongoose")
//import modul transactions
const transModel= require("./transModel")
const userModel=require("../userModel")
const ingModel= require("../ingredients/ingredientsModel")
const moment=require("moment")
const jwt= require("jsonwebtoken");
const { findByIdAndUpdate } = require('../ingredients/ingredientsModel')

//get data transaction menggunkan lookup dan dataloader
async function getAllTransaction(parent,{page, limit,last_name_user, recipe_name,order_status,order_date}){
    let queryAgg= [
        {
            $skip:(page-1)*limit
        },
        {
            $limit:limit
        }
    ];
    if(last_name_user){
        // POPULATE SINI
        queryAgg.push( 
            {
            $lookup:{
                from:"users",
                localField:"user_id",
                foreignField:"_id",
                as:"user_populate"
            },
            
        },
        {
            $match:{
                "user_populate.last_name":last_name_user
            }
            
        } ,
        )
    }
    if(recipe_name){
        queryAgg.push(
            {
                $lookup:{
                    from:"recipes",
                    localField:"menu.recipe_id",
                    foreignField:"_id",
                    as:"recipe_populate"
                }
            },
            {
                $match:{
                    "recipe_populate.recipe_name":recipe_name
                }
            }
        )
    }
    if(order_status=="success"){
        queryAgg.push(
            {
                $match:{
                    order_status:order_status
                }
            }
        )
        
    }
    if(order_date){
        queryAgg.push(
            {
                $match:{
                    order_date:order_date
                }
            }
        )
    }
    let getTrans = await transModel.aggregate(queryAgg)
    getTrans.map((el)=>{
        el.id = mongoose.Types.ObjectId(el._id)
            return el
       })
    return getTrans

    // const getTrans= await transModel.find()
    // return getTrans
   
}


//function untuk memangil data loader dari user
async function loadUser(parent,args, context){
    if(parent.user_id){
        // console.log(await context.bookloders.load(parent,created_by))
        // console.log(parent)
    return await context.loadUser.load(parent.user_id)
    }
    
}

//function untuk memangil data loader dari ingredients
async function loadingredient(parent,args, context){
    if(parent.recipe_id){
        // console.log(await context.bookloders.load(parent,created_by))
        // console.log(parent)
    return await context.loaderRecepi.load(parent.recipe_id)
    }
    
}

//function untuk mendapatkan satu data dari transactions
async function getOneTransaction(parent,{id}){
    try{
        if(!id){
            throw new ApolloError("masukan id")
        }else{
            const getOneTrans = await transModel.findById(id)
            return getOneTrans 
        }
    }catch(err){
        throw new ApolloError(err)
    }
}

//function untuk mengurangi stock yang ada pada ingredients
async function reduceingredientStock(arrIngredient){
    for (let ingredient of arrIngredient){
        await ingModel.findByIdAndUpdate(ingredient.ingredient_id,{stock:ingredient.stock})
    }
}

async function validateStockIngredient(user_id, menus){
    let transaction_menu = new transModel({menu:menus})
     transaction_menu = await transModel.populate(transaction_menu,{
        path:"menu.recipe_id",
        populate:{
            path: "ingredients.ingredient_id"
        }
     })
     const ingredientMap=[]
     for (let recipe of transaction_menu.menu){
        const amount= recipe.amount
        for(let ingredient of recipe.recipe_id.ingredients){
            ingredientMap.push({
                ingredient_id: ingredient.ingredient_id.id,
                stock: ingredient.ingredient_id.stock - (ingredient.stock_used*amount)
            });
            if( ingredient.ingredient_id.stock < (ingredient.stock_used*amount)) return new transModel({user_id, menu:menus, order_status:"failed"})
        }
     }
     reduceingredientStock(ingredientMap);
     return new transModel({user_id, menu:menus, order_status:"success"})
}

async function CreateTransactions(parent,{menu,order_date},context){
    order_date = moment(new Date).format("LLLL")
    let User= context.req.user_id
    
    if(menu){
        const addmenu= await validateStockIngredient(User.id,menu,order_date)
        await addmenu.save()
        return addmenu
    }else{
       throw new ApolloError("menu kosong")
    }
    

    //validasi stock
    // for(amount of addmenu.menu){
    //     console.log(amount.amount*2)
    // }

}


//functions untuk mendelete transactions
async function DeleteTransaction(parent,{id,status}){
    let delTrans= await userModel.findByIdAndUpdate(id,{
        status:status
    },{new:true})
    return delTrans
}
    

const trans_resolvers={
    Query:{
        getAllTransaction,
        getOneTransaction
    },
    Mutation:{
        CreateTransactions,
        DeleteTransaction
    },
    trans_menu:{
        recipe_id:loadingredient
    },
    transactions:{
        user_id:loadUser
    },

}

module.exports=trans_resolvers