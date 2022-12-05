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
        default:"unpublish"
    },
    description:{
        type:String
    },
    image:{
        type:String

    },
    menu_highlight:{
        type:Boolean,
        default: false
    },
    special_offers:{
        type:Boolean,
        default: false
    },
    discount:{
        type:Number,
        default:20
    }
})

const recipeModel= mongoose.model("recipes", recipesSchema)
module.exports= recipeModel