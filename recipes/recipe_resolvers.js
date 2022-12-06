//import model dari recipes
const recipeModel= require("./recipesModel")

//impor ingredients
const ingredientsModel= require("../ingredients/ingredientsModel")

//impor moongoose
const mongoose = require('mongoose');

//impor apollo error
const { ApolloError } = require('apollo-server-errors');
const ingModel = require("../ingredients/ingredientsModel");

//untuk memanggil data recipes dengan menggunakn loader
async function getAllRecipes(parent,{page, limit,recipe_name, menu_highlight,status,special_offers}){
    //untuk menghitung jumlah documen yang berstatus publish
    let publish = await recipeModel.find({status:"publish"})
    const count_publish = publish.length
    
    //untuk menghitung jumlah documen yang berstatus unpublish
    let unpublish = await recipeModel.find({status:"unpublish"})
    const count_unpublish = unpublish.length

    //untuk menghitung jumlah documen yang berstatus deleted
    let deleted = await recipeModel.find({status:"deleted"})
    const count_deleted = deleted.length

    const count_total = await recipeModel.count()
    let queryAgg= [ 
    {
        $match:{
            status:{
                $ne:"deleted"
            }
        }
    },
    {
        $skip : (page-1)*limit
    },
    {
        $limit:limit
    }
    ]

    if(recipe_name){
        queryAgg.push(
            {
                $match:{
                    recipe_name:new RegExp(recipe_name,"i")
                }
            }
        )
    }
    if(status === "publish"){
        queryAgg.unshift(
            {
                $match:{
                    status:"publish"
                }
            }
        )
    }
    if(status === "unpublish"){
        queryAgg.unshift(
            {
                $match:{
                    status:"unpublish"
                }
            }
        )
    }
    if(menu_highlight === true){
        queryAgg.push(
            {
                $match:{
                    menu_highlight:true
                }
            }
        )
    }

    if(special_offers === true){
        queryAgg.push(
            {
                $match:{
                    special_offers:true
                }
            }
        )
    }


    
    let getRecipes= await recipeModel.aggregate(queryAgg)
    getRecipes.map((el)=>{
        el.id = mongoose.Types.ObjectId(el._id)
            return el
       })
       getRecipes = {
        data_recipes: getRecipes,
        count_publish:count_publish,
        count_unpublish:count_unpublish,
        count_deleted:count_deleted,
        count_total:count_total,
        page: page,
        max_page:  Math.ceil( count_total / limit),
        
        };
    return  getRecipes
}

async function getAllRecipesNoToken(parent,{page, limit,recipe_name, menu_highlight,status,special_offers}){
    //untuk menghitung jumlah documen yang berstatus publish
    let publish = await recipeModel.find({status:"publish"})
    const count_publish = publish.length
    
    //untuk menghitung jumlah documen yang berstatus unpublish
    let unpublish = await recipeModel.find({status:"unpublish"})
    const count_unpublish = unpublish.length

    //untuk menghitung jumlah documen yang berstatus deleted
    let deleted = await recipeModel.find({status:"deleted"})
    const count_deleted = deleted.length

    const count_total = await recipeModel.count()
    let queryAgg= [ 
    {
        $match:{
            status:{
                $ne:"deleted"
            }
        }
    },
    {
        $skip : (page-1)*limit
    },
    {
        $limit:limit
    }
    ]

    if(recipe_name){
        queryAgg.push(
            {
                $match:{
                    recipe_name:new RegExp(recipe_name,"i")
                }
            }
        )
    }
    if(status === "publish"){
        queryAgg.unshift(
            {
                $match:{
                    status:"publish"
                }
            }
        )
    }
    if(status === "unpublish"){
        queryAgg.unshift(
            {
                $match:{
                    status:"unpublish"
                }
            }
        )
    }
    if(menu_highlight === true){
        queryAgg.push(
            {
                $match:{
                    menu_highlight:true
                }
            }
        )
    }
    if(special_offers === true){
        queryAgg.push(
            {
                $match:{
                    special_offers:true
                }
            }
        )
    }

    let getRecipes= await recipeModel.aggregate(queryAgg)
    getRecipes.map((el)=>{
        el.id = mongoose.Types.ObjectId(el._id)
            return el
       })
       getRecipes = {
        data_recipes: getRecipes,
        count_publish:count_publish,
        count_unpublish:count_unpublish,
        count_deleted:count_deleted,
        count_total:count_total,
        page: page,
        max_page:  Math.ceil( count_total / limit),
        
        };
    return  getRecipes
}

//function untuk available atau jumlah yang hanya bisa dibeli
async function getAvailable(parent,args,context){
    const minStock = []
    for (let ingredient of parent.ingredients){
        const recipe_ing = await ingredientsModel.findById(ingredient.ingredient_id)
        if(!recipe_ing)throw new ApolloError("id not found")
        minStock.push(Math.floor(recipe_ing.stock / ingredient.stock_used))
    }
    return Math.min(...minStock)
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
async function CreateRecipes(parent,{recipe_name,description,image,ingredients,stock_used,price,status,menu_highlight,special_offers,discount}){
//    for(let bahan of ingredients){
//     const checkBahan = await ingModel.findById(bahan.ingredient_id)
//     if(checkBahan.status === "deleted")throw new ApolloError("bahan tidak bisa digunakan")
//    }
        const addrecipes= await new recipeModel({
         recipe_name:recipe_name,
         description:description,
         image:image,
         ingredients:ingredients,
         stock_used:stock_used,
         price:price,
         status:status,
         menu_highlight:menu_highlight,
         special_offers:special_offers,
         discount:discount
        })
      addrecipes.save()
      return addrecipes

}

async function AfterDiscount(parent,args,context){
    // console.log(parent)
    if(parent.special_offers === true){
        const dis = parent.price*(parent.discount/100)
        let afterdiscount = parent.price - dis
        return afterdiscount
    }else{
        return 0
    }
}


//untuk mealukan updating pada recepies dengan mengganti id ingredients atau ganti nama,dll
async function UpdateRecipe(parent,{id,recipe_name,description,image,ingredients,price,status,menu_highlight,special_offers,discount}){
    const UpdRecipe= await recipeModel.findByIdAndUpdate(id,{
    recipe_name:recipe_name,
    description:description,
    image:image,
    ingredients:ingredients,
    price:price,
    status:status,
    menu_highlight:menu_highlight,
    special_offers:special_offers,
    discount:discount
    },{new:true})
    if(ingredients){
        for(let ingredient of ingredients){
           const bahan = await ingModel.findById(ingredient.ingredient_id)
           if (bahan.stock < ingredient.stock_used){
            throw new ApolloError("less ingredient")
           }
        }
    }
    return UpdRecipe
}

//untuk melakukan delete atau mengganti satatu
async function DeleteRecipe(parent,{id,status}){
    const delrecipe = await recipeModel.findByIdAndUpdate(id,{
        $set:{
            status:"deleted"
        }
    },{new:true})
    return delrecipe
}



const recipeResolvers={
    Query:{
        getAllRecipes,
        getAllRecipesNoToken,
        getOneRecipes
    },
    Mutation:{
        CreateRecipes,
        UpdateRecipe,
        DeleteRecipe
    },
    ingredientid:{
        ingredient_id:loadingredient
    },
    recipes:{
        available: getAvailable,
        afterDiscount:AfterDiscount
    }
}

module.exports= recipeResolvers