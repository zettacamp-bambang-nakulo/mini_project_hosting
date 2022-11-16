//import data model ingredient
const ingModel= require("./ingredientsModel")
//impor model recipe
const recipeModel = require("../recipes/recipesModel")
//import mongoose
const mongoose= require("mongoose")
const { ApolloError } = require('apollo-server-errors')

//-------------------------------------------collection ingredients-----------------------------------------------------//
// create ingredients
async function CreateIngredints(parent,{name,stock}){
    let addIngredint = await new ingModel({
        name:name,
        stock:stock
    })
    addIngredint.save()
    return addIngredint
}

// get all data berdasarkan dari stock lebih dari 0
async function getAllIngredients(parent,{stock,page,limit}){
    let queryAgg=[];
    if(stock > 0 ){
        queryAgg.push(
            {
                $skip: (page-1)*limit
            },
            {
                $limit:limit
            },
            {
                $project:{
                    id:1, name:1,stock:1,status:1
                }
            },
            {
                $match:{
                    status:"active"
                }
            }
        )
    }else{
        throw new ApolloError("stock empty")
    }
    let getIng= await ingModel.aggregate(queryAgg)
    getIng.map((el)=>{
        el.id = mongoose.Types.ObjectId(el._id)
            return el
       })
    return getIng

}

// untuk mendaptkan salah satu data dengan by id
async function getOneIngredients(parent,{id}){
    if(id){
        const getone= await ingModel.findById(id)
        return getone
    }else{
        return new ApolloError(" id harus dimasukan")
    }
}

//update stock
async function UpdateIngredients(parent,{id,name, stock}){
    let changeIng = await ingModel.findByIdAndUpdate(id,{
        name:name,
        stock:stock

    },{new:true})
    return changeIng
}

//delete atau merubah data ingredients
async function DeleteIngredients(parent,{id,name,stock,status}){
    const checkRecipe = await recipeModel.aggregate([
        {
            $match:{
                "ingredients.ingredient_id":mongoose.Types.ObjectId(id)
            }
        }
    ])
    if(checkRecipe.length !== 0){
        throw new ApolloError("ingredients has been used ")
    }else{
        const delIng = await ingModel.findByIdAndUpdate(id,
        {
            $set:{
                status:"deleted"
            }
        })
        if(!delIng){
            throw new ApolloError("ingredients is delete")
        }
        
    return delIng
    }

}


const resolversing={
    Query:{
        getAllIngredients,
        getOneIngredients
    },
    Mutation:{
        CreateIngredints,
        UpdateIngredients,
        DeleteIngredients
    }
}

module.exports= resolversing