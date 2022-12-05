const DataLoader= require("dataloader")
const ingModel= require("./ingredientsModel")


const loadingredient= async function(ingredients){
    const ingID= await ingModel.find({
        _id:{
            $in: ingredients
        }
    })
   const ingMap={}
   ingID.forEach((list)=>{
    ingMap[list._id]=list
   })
   return ingredients.map(id => ingMap[id])
}

const loderIngredient= new DataLoader(loadingredient)
module.exports= loderIngredient