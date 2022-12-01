const DataLoader= require("dataloader")
const recipeModel= require("./recipesModel")

const loadUser= async function(recipe_id){
    const RecepiID= await recipeModel.find({
        _id:{
            $in: recipe_id
        }
    })
   const RecepiMap={}
   RecepiID.forEach((list)=>{
    RecepiMap[list._id]=list
   })
   return recipe_id.map(id =>  RecepiMap[id])
}

const loderRecipe= new DataLoader(loadUser)
module.exports= loderRecipe