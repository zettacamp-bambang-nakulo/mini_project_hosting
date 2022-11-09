//import model dari recipes
const recipeModel= require("./recipesModel")

//untuk memanggil data recipes dengan menggunakn loader
async function getAllRecipes(){
    const getRecipes= await recipeModel.find()
    return  getRecipes
}

//untuk loader data  ingredients
async function loadingredient(parent,args, context){
    if(parent.ingredient_id){
        // console.log(await context.bookloders.load(parent,created_by))
        // console.log(parent)
    return await context.ingredientloaders.load(parent.ingredient_id)
    }
    
}

//untuk memanggil data recipes berdasarkan idnya
async function getOneRecipes(parent,{id}){
    const getOne= await recipeModel.findById(id)
    return getOne
}

//untuk membuat create recipes
async function CreateRecipes(parent,{recipe_name,ingredients,stock,status}){
   const addrecipes= await new recipeModel({
    recipe_name:recipe_name,
    ingredients:ingredients,
    stock:stock,
    status:status
   })
 addrecipes.save()
 return addrecipes
}

async function UpdateRecipe(parent,{id,recipe_name,ingredients}){
    console.log(ingredients)
    const UpdRecipe= await recipeModel.findByIdAndUpdate(id,{
    recipe_name:recipe_name,
    ingredients:ingredients
    },{new:true})
    return UpdRecipe
}


const recipeResolvers={
    Query:{
        getAllRecipes,
        getOneRecipes
    },
    Mutation:{
        CreateRecipes,
        UpdateRecipe
    },
    ingredientid:{
        ingredient_id:loadingredient
    }
}

module.exports= recipeResolvers