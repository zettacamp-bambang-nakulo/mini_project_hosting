//import untuk apollo error
const { ApolloError } = require('apollo-server-errors')
//import mongoose
const mongoose= require("mongoose")
//import modul transactions
const transModel= require("./transModel")
const userModel=require("../userModel")
const ingModel= require("../ingredients/ingredientsModel")
const moment=require("moment")
const { findByIdAndUpdate } = require('../ingredients/ingredientsModel')
const recipeModel = require('../recipes/recipesModel')

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
     let total = 0
     for (let recipe of transaction_menu.menu){
        if( recipe.recipe_id.status === "deleted") throw new ApolloError("status deleted")
        const amount= recipe.amount
        const price = recipe.recipe_id.price
        total = (price*amount)+(price*amount)+(price*amount)
        for(let ingredient of recipe.recipe_id.ingredients){
            ingredientMap.push({
                ingredient_id: ingredient.ingredient_id.id,
                stock: ingredient.ingredient_id.stock - (ingredient.stock_used*amount)
            });
            if( ingredient.ingredient_id.stock < (ingredient.stock_used*amount)) return new transModel({user_id, menu:menus,order_status:"failed"})
            
        }
     }
     reduceingredientStock(ingredientMap);
     return new transModel({user_id, menu:menus, total:total,order_status:"success"})
}

//function untuk membuat transactions dengan menggunakan validasi
async function CreateTransactions(parent,{menu,order_date,order_status},context){
    // console.log(price)
    order_date = moment(new Date).format("LLLL")
    let User= context.req.user_id
    if(menu){
        const addmenu= await new transModel({
            user_id:User.id,
            menu:menu,
            order_date,
            order_status:"pending"

        })
        await addmenu.save()
        // console.log(addmenu)
        return addmenu
    }else{
       throw new ApolloError("menu kosong")
    }
    

    //validasi stock
    // for(amount of addmenu.menu){
    //     console.log(amount.amount*2)
    // }

}

//nambahin parameter baru dan jika updatenya false makan update biasa , jika true makan manggil validasi semua
// async function UpdateTransaction(parent,{id,menu},context){
//     let User= context.req.user_id
//     const updateTrans= await validateStockIngredient()

// }

async function getTotal(menu){
    let total= []
    let totalPrice= []
    for(recipe of menu){
        recipeTotal = await recipeModel.findOne(
            {
                id :recipe.recipe_id
            }
        )
        total.push(recipe.amount*recipeTotal.price)
        totalPrice = total.reduce((a,b)=>a+b);
    }
    return totalPrice
}

async function addCart(parent,{id,menu},context){
    let User= context.req.user_id
    const check = await transModel.aggregate([
        {
            $match:{
                "User_id":mongoose.Types.ObjectId(User)
            }
        }
    ])
    if(check){
        const total_price = await getTotal(menu)
        console.log(total_price)
        const add = await transModel.findByIdAndUpdate(id,
        {
            $push:{
                menu:menu
            },
        },{new:true}       
            )
            
        return add
    }


}

// belum jadi yang deleted
async function deleteCart(parent,{id},context){
    let User= context.req.user_id
    const check = await transModel.findOne(
        {
            $and:[
                {
                    order_status:"pending"
                },
                {
                    user_id:User.id
                }
            ]
        }
    )
    const checkRecipe = await transModel.find(
        {
            menu:{
                $elemMatch:{
                    _id:mongoose.Types.ObjectId(id)
                }
            }
        }
    )
    // console.log(checkRecipe)
    if(checkRecipe){
        const delCart = await transModel.findByIdAndUpdate(check.id,
            {
               $pull:{
                menu:{recipe_id:mongoose.Types.ObjectId(id)},
               }  
            },{new:true}
            )
        return delCart
    }
}

//functions untuk mendelete transactions
async function DeleteTransaction(parent,{id,status}){
    let delTrans= await transModel.findByIdAndUpdate(id,{
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
        DeleteTransaction,
        addCart,
        deleteCart
        
    },
    trans_menu:{
        recipe_id:loadingredient
    },
    transactions:{
        user_id:loadUser
    },

}

module.exports=trans_resolvers