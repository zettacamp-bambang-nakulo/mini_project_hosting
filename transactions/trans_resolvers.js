//import untuk apollo error
const { ApolloError } = require('apollo-server-errors')
//import mongoose
const mongoose= require("mongoose")
//import modul transactions
const transModel= require("./transModel")
const userModel=require("../users/userModel")
const ingModel= require("../ingredients/ingredientsModel")
const moment=require("moment")
const { findByIdAndUpdate } = require('../ingredients/ingredientsModel')
const recipeModel = require('../recipes/recipesModel')
const { get } = require('lodash')

//get data transaction menggunkan lookup dan dataloader
async function getAllTransaction(parent,{page, limit,last_name_user, recipe_name,order_status,order_date},context){
    // console.log(context.loadUser)
    let User= context.req.user_id    
    const count_pending = await transModel.find({order_status:"pending"})
    const count_success = await transModel.find({order_status:"success"})
    const count_failed = await transModel.find({order_status:"failed"})
    const count_total = await transModel.count()
    let queryAgg= [];
    if(page){
        queryAgg.unshift(
            {
                $skip:(page-1)*limit
            },
            {
                $limit:limit
            },
            {
                $sort :{
                    order_date:-1
                }
            }
        )
    }
    if(User.role === "user"){
        queryAgg.unshift({
            $match:{
                user_id:mongoose.Types.ObjectId(User.id)
             }
    })
    }
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
        queryAgg.unshift(
            {
                $match:{
                    order_status:"success"
                }
            }
        )
        
    }
    if(order_status ==="pending"){
        queryAgg.unshift(
            {
                $match:{
                    order_status:"pending",
                    status:"active"
                }
            }
        )
    }
    if(order_status ==="failed"){
        queryAgg.unshift(
            {
                $match:{
                    order_status:"failed"
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
       getTrans = {
        data_transaction: getTrans,
        count_pending:count_pending.length,
        count_success:count_success.length,
        count_failed:count_failed.length,
        count_total:count_total,
        page: page,
        // maxe_page_pending:Math.ceil(count_pending/limit),
        max_page:  Math.ceil( count_total / limit),
        
        };
      
    return getTrans

    // const getTrans= await transModel.find()
    // return getTrans
   
}

async function getHistory(parent,{page, limit,last_name_user, recipe_name,order_status,order_date},context){
    // console.log(context.loadUser)
    let User= context.req.user_id  
    const count_pending = await transModel.find({order_status:"pending"})
    const count_success = await transModel.find({order_status:"success"})
    const count_failed = await transModel.find({order_status:"failed"})
    const count_total = await transModel.count() 
    let queryAgg= [];
    if(page){
        queryAgg.unshift(
            {
                $skip:(page-1)*limit
            },
            {
                $limit:limit
            } 
        )
    }
    if(!order_status){
        queryAgg.unshift(
            {
                $match:{
                    order_status:{
                        $ne:"pending"
                    }
                }
            }
        )
    }else{
        queryAgg.unshift(
            {
                $match:{
                    order_status:order_status
                }
            }
        )
    }
    if(User.role === "user"){
        queryAgg.push({
            $match:{
                user_id:mongoose.Types.ObjectId(User.id)
             }
    })
    }
    if(last_name_user){
        // POPULATE SINI
        queryAgg.unshift( 
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
                "user_populate.last_name": RegExp(last_name_user,"i")
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
    // if(order_status=="success"){
    //     queryAgg.unshift(
    //         {
    //             $match:{
    //                 order_status:"success"
    //             }
    //         }
    //     )
        
    // }
    // if(order_status ==="pending"){
    //     queryAgg.unshift(
    //         {
    //             $match:{
    //                 order_status:"pending"
    //             }
    //         }
    //     )
    // }
    // if(order_status ==="failed"){
    //     queryAgg.unshift(
    //         {
    //             $match:{
    //                 order_status:"failed"
    //             }
    //         }
    //     )
    // }
    if(order_date){
        queryAgg.unshift(
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
       getTrans = {
        data_transaction: getTrans,
        count_pending:count_pending.length,
        count_success:count_success.length,
        count_failed:count_failed.length,
        count_total:count_total,
        page: page,
        // maxe_page_pending:Math.ceil(count_pending/limit),
        max_page:  Math.ceil( count_total / limit),
        
        };
    // console.log(JSON.stringify(queryAgg))
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
async function getOneTransaction(parent,args,context){
    try{
            let User= context.req.user_id
            const getOneTrans = await transModel.findOne({order_status:"pending", user_id:User.id})
            // console.log(getOneTrans)
            return getOneTrans 
        
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
    const user = await userModel.findOne({_id:user_id})
     transaction_menu = await transModel.populate(transaction_menu,{
        path:"menu.recipe_id",
        populate:{
            path: "ingredients.ingredient_id"
        }
     })

     const ingredientMap=[]
     let total = 0
     for (let recipe of transaction_menu.menu){
        if(recipe.recipe_id.status ==="unpublish")throw new ApolloError("menu is unpublish not order now")
        if( recipe.recipe_id.status === "deleted") throw new ApolloError("status deleted")
        const amount= recipe.amount
        const price = recipe.recipe_id.price
        total += price*amount
        for(let ingredient of recipe.recipe_id.ingredients){
            ingredientMap.push({
                ingredient_id: ingredient.ingredient_id.id,
                stock: ingredient.ingredient_id.stock - (ingredient.stock_used*amount)
            });
            if( ingredient.ingredient_id.stock < (ingredient.stock_used*amount)){
                let Validasifailed =  await transModel.findByIdAndUpdate(id,{user_id,menu:menus,order_status:"failed"},{new:true})
                if(Validasifailed.order_status ==="failed")throw new ApolloError("order is failed")
                return Validasifailed
                
            }
            
        }
    }
   
    //  if(transaction_menu.amount > available){
    //      throw new ApolloError(" amount lebih dari avaible")
    //  }
    let total_all = await getTotal({menu:menus})
    await userModel.updateOne({_id:user_id},
        {
            $set:{
                saldo:user.saldo-=total_all
            }
        }
        )
        if(user.saldo < total_all ){
            throw new ApolloError("less balance")
        }
        if(user.saldo < 0){
            throw new ApolloError("kurang")
        }
    
     const ValidasiSuccess = await transModel.findByIdAndUpdate(id,{menu:menus, total:total,order_status:"success"},{new:true})
     reduceingredientStock(ingredientMap);
    //  userSaldo
    return ValidasiSuccess
}

async function incomingAdmin(parent,args,context){
    let User= context.req.user_id 
    
    if(User.role === "admin"){
        const checkAdmin = await transModel.find(
            {
                order_status:"success"
            }
        )
        let balance = 0
        for(el of checkAdmin){
            balance += el.total
        }
        return { balanceAdmin:balance}
    }
    // return balance
    // return balance
}

async function addCart(parent,{menu,order_date},context){
    let User= context.req.user_id
    const checkTransacation = await transModel.findOne({
        $and:[
            {
                order_status:"pending"
            },
            {
                user_id:User.id
            }
        ]
    })
    // console.log(check)
    if(!checkTransacation){
        order_date = moment(new Date).format("LL")
        const addmenu= await new transModel({
            user_id:User.id,
            menu:menu,
            order_date,

        })
        await addmenu.save()
        // console.log(addmenu)
        return addmenu

    }else{
        let add = await transModel.find(
            {
                _id : mongoose.Types.ObjectId(checkTransacation._id),
                menu:{
                    $elemMatch:{recipe_id:mongoose.Types.ObjectId(menu[0].recipe_id)}
                }
            }
        )
        console.log(add)
        if(add.length > 0){
            throw new ApolloError("menu sudah ada")
        }
        for(let status of menu){
            const checkStatus = await recipeModel.findById(status.recipe_id)
            if(checkStatus.status ==="unpublish"){
                throw new ApolloError("the menu has been unpublished")
            }
        }
        add = await transModel.findByIdAndUpdate(checkTransacation._id,
            {
                $push:{
                    menu:menu,
                },
            },{new:true}       
                ) 
        
        return add
    }

}

async function TotalRecipe(menu,args,context){
    // console.log(menu.recipe_id)
    let Total_Recipe = 0
    const recipe = await recipeModel.findById(menu.recipe_id).lean()
    // console.log(recipe.special_offers)
    if (recipe){
        Total_Recipe = (recipe.price *menu.amount)
        // console.log(Total_Recipe)
    }
    if(recipe.special_offers === true){
        currentPrice = recipe.price *menu.amount;
        dicount = currentPrice *(recipe.discount/100)
        // console.log(recipe.discount/100)
        Total_Recipe = (currentPrice-dicount)
        // console.log(recipe.price)
    }
return Total_Recipe
}

//function untuk menambahkan menu ke dalam add cart
async function getTotal({menu},args,context){
    if(!menu){
        return null
    }
    let total_price = 0 
    for(let el of menu ){
        let total_items = await TotalRecipe(el)
        const recipe = await recipeModel.findById(el.recipe_id)
        // console.log(recipe)
        if(recipe){
            total_price += total_items
            // 
        }

    }
    // console.log(total_price)
    return total_price 
}

async function UpdateCart(parent,{id,note},context){
    // console.log(id)
    await transModel.updateOne({
        "menu._id":mongoose.Types.ObjectId(id),
       
    }, {
        $set:{

            "menu.$.note": note
        }
    },{new:true}
    )
    return  await transModel.findOne({"menu._id":mongoose.Types.ObjectId(id)})
}
//function untuk melakukan transaksi keseluruhannya
async function OrderTransaction(parent,args,context){
    // console.log(context.user)
    let User= context.req.user_id
    const checktrans = await transModel.findOne(
        {
            $and:[
                {
                    user_id:mongoose.Types.ObjectId(User.id)
                },
                {
                    order_status:"pending"
                },
            ]
        }
    )
    if(checktrans){
        let checkValidate = await validateStockIngredient(User.id,checktrans._id,checktrans.menu,order_date = moment(new Date).format("LL"))
        return checkValidate
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
    // console.log(menu_id)
        await transModel.updateOne({
           "menu._id":mongoose.Types.ObjectId(menu_id),
          
       }, {
           $inc:{
               "menu.$.amount": -amount
           }
       },{new:true}
       )
       const amountEmpty = await transModel.findOne({"menu._id":mongoose.Types.ObjectId(menu_id),"menu.amount":0,order_status:"pending"})
       if (amountEmpty){
        await amountEmpty.updateOne({$pull:{menu:{_id:mongoose.Types.ObjectId(menu_id)}}})
       }
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
                menu:{_id:mongoose.Types.ObjectId(id)},
               }  
            },{new:true}
            )
        return delCart
    }
}

//functions untuk mendelete transactions
async function DeleteTransaction(parent,args,context){
    await transModel.updateMany(
            {
                status:"active"
            },
            {
                $set: {
                    status:"deleted"
                }
            },{new:true})
    // console.log("helo delete trans")
    // let delTrans = await transModel.find(
    //     {
    //         status:"active"
    //     }
    //     )\

    return await transModel.find({status:"deleted"})
}
    

const trans_resolvers={
    Query:{
        getAllTransaction,
        getHistory,
        getOneTransaction,
        incomingAdmin
    },
    Mutation:{
        addCart,
        DeleteTransaction,
        UpdateCart,
        OrderTransaction,
        incrAmaount,
        decrAmaount,
        deleteCart,
    },
    trans_menu:{
        recipe_id:loadingredient,
        total_recipe:TotalRecipe
    },
    transactions:{
        user_id:loadUser,
        total:getTotal,
       
    },


}

module.exports=trans_resolvers
