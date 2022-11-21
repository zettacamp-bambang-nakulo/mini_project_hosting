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
async function getAllTransaction(parent,{page, limit,last_name_user, recipe_name,order_status,order_date},context){
    // console.log(context.loadUser)
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
    if(order_status ==="pending"){
        queryAgg.push(
            {
                $match:{
                    order_status:order_status
                }
            }
        )
    }
    if(order_status ==="failed"){
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
    let pending = await transModel.find({order_status:"pending"})
    const count_pending = pending.length

    let success = await transModel.find({order_status:"success"})
    const count_success = success.length

    let failed = await transModel.find({order_status:"failed"})
    const count_failed = failed.length

    const count_total = await transModel.count()
    let getTrans = await transModel.aggregate(queryAgg)
    getTrans.map((el)=>{
        el.id = mongoose.Types.ObjectId(el._id)
            return el
       })
       getTrans = {
        data_transaction: getTrans,
        count_pending:count_pending,
        count_success:count_success,
        count_failed:count_failed,
        count_total:count_total,
        page: page,
        max_page:  Math.ceil( count_total / limit),
        
        };
    return getTrans

    // const getTrans= await transModel.find()
    // return getTrans
   
}


//function untuk memangil data loader dari user
async function loadUser(parent,args, context){
    if(parent.user_id){
        // console.log(await context.bookloders.load(parent,created_by))
    // console.log(await context.loadUser.load(parent.user_id))
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

async function validateStockIngredient(user_id,id, menus){
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
        total += price*amount
        for(let ingredient of recipe.recipe_id.ingredients){
            ingredientMap.push({
                ingredient_id: ingredient.ingredient_id.id,
                stock: ingredient.ingredient_id.stock - (ingredient.stock_used*amount)
            });
            if( ingredient.ingredient_id.stock < (ingredient.stock_used*amount)) return new transModel({user_id, id,menu:menus,order_status:"failed"})
            
        }
     }
     reduceingredientStock(ingredientMap);
     const test = await transModel.findByIdAndUpdate(id,{menu:menus, total:total,order_status:"success"},{new:true})
    //  return await transModel({user_id,id, )
    return test
}

//function untuk membuat transactions dengan menggunakan validasi
async function CreateTransactions(parent,{menu,order_date},context){
    // console.log(price)
    order_date = moment(new Date).format("LLLL")
    let User= context.req.user_id
    if(menu){
        const addmenu= await new transModel({
            user_id:User.id,
            menu:menu,
            order_date,

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

async function getTotal({menu,amount},args,context){
    // console.log(menu)
    let total_price = 0 
    for(let el of menu ){
        const recipe = await recipeModel.findById(el.recipe_id)
        total_price += (recipe.price *el.amount)

    }
    return total_price

}

//function untuk menambahkan menu ke dalam add cart
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
        const add = await transModel.findByIdAndUpdate(id,
        {
            $push:{
                menu:menu,
            },
        },{new:true}       
            )
            
        return add
    }


}

//function untuk melakukan transaksi keseluruhannya
async function OrderTransaction(parent,{id,order_status},context){
    let User= context.req.user_id
    const checktrans = await transModel.findOne(
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
    // console.log(checktrans)
    if(checktrans){
        // let orderValidasi = await validateStockIngredient(User.id,id,checktrans.menu)
        let coba = await validateStockIngredient(User.id,checktrans.id,checktrans.menu)
        console.log(coba.order_status)
        // coba.save()
        return coba
        
        // console.log( await transModel.findByIdAndUpdate(id,{coba}))
    }

}

//function untuk menambah amount
async function incrAmaount(parent,{menu_id,amount,total},context){

     await transModel.updateOne({
        "menu._id":mongoose.Types.ObjectId(menu_id),
       
    }, {
        $inc:{
            "menu.$.amount": amount,
        }
    },{new:true}
    )
    return await transModel.findOne({"menu._id":mongoose.Types.ObjectId(menu_id)})
    
}

//function untuk mengurangi amount
async function decrAmaount(parent,{menu_id,amount},context){
    await transModel.updateOne({
       "menu._id":mongoose.Types.ObjectId(menu_id),
      
   }, {
       $inc:{
           "menu.$.amount": -amount
       }
   },{new:true}
   )
   return await transModel.findOne({"menu._id":mongoose.Types.ObjectId(menu_id)})
   
}

// function untuk mendelete cart yang ditambahin
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
        $set:{
            status:"deleted"
        }
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
        OrderTransaction,
        incrAmaount,
        decrAmaount,
        deleteCart
    },
    trans_menu:{
        recipe_id:loadingredient
    },
    transactions:{
        user_id:loadUser,
        total:getTotal
    },
    // transactions:{
    //     total:getTotal
    // }


}

module.exports=trans_resolvers