const mongoose= require("mongoose")

const ingredientScheman= new mongoose.Schema({
    name:String,
    stock:Number,
    status:{
        type:String,
        enum:["active", "deleted"],
        default:"active"
    } 
})

const ingModel= mongoose.model("ingredients", ingredientScheman)
module.exports= ingModel