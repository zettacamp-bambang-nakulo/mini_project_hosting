const mongoose= require("mongoose")

const recipesSchema= new mongoose.Schema({
    recipe_name:String,
    ingredients:[{
        ingredient_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"ingredients"
        },
        stock_used:{
            type:Number
        }
    }],
    price:{
        type:Number

    },
    status:{
        type:String,
        enum:["publish","unpublish", "deleted"],
        default:"publish"
    } 
})

const recipeModel= mongoose.model("recipes", recipesSchema)
module.exports= recipeModel