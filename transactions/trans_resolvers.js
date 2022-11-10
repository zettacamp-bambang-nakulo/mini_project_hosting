const { ApolloError } = require('apollo-server-errors')
const mongoose= require("mongoose")
const transModel= require("./transModel")

//get data transaction menggunkan lookup dan dataloader
async function getAllTransaction(parent,{last_name_user, recipe_name,order_status,order_date}){
    let query ={$and:[]};
    let queryAgg= [];
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
                    order_date:moment(order_date).toDate()
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

async function loadUser(parent,args, context){
    if(parent.user_id){
        // console.log(await context.bookloders.load(parent,created_by))
        // console.log(parent)
    return await context.loadUser.load(parent.user_id)
    }
    
}


async function loadingredient(parent,args, context){
    if(parent.recipe_id){
        // console.log(await context.bookloders.load(parent,created_by))
        // console.log(parent)
    return await context.loaderRecepi.load(parent.recipe_id)
    }
    
}

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
    

const trans_resolvers={
    Query:{
        getAllTransaction,
        getOneTransaction
    },
    trans_menu:{
        recipe_id:loadingredient
    },
    transactions:{
        user_id:loadUser
    },

}

module.exports=trans_resolvers