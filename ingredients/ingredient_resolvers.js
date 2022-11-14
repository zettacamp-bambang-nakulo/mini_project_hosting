//import data model ingredient
const ingModel= require("./ingredientsModel")
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
            }
        )
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
async function UpdateIngredients(parent,{id, stock}){
    let changeIng = await ingModel.findByIdAndUpdate(id,{
        stock:stock

    },{new:true})
    return changeIng
}

//delete atau merubah data ingredients
async function DeleteIngredients(parent,{id,name,stock,status}){
    const delIng = await ingModel.findByIdAndUpdate(id,{
        name:name,
        stock:stock,
        status:status
    },{new:true})
    return delIng
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