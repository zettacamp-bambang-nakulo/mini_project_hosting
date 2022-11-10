const mongoose= require("mongoose")

const transactionsSchema= new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    menu:[{
        recipe_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"recipes"
        },
        amount:{
            type:Number
        },
        note:{
            type:String
        }

    }],
    order_status:{
        type:String,
        enum:["success", "failed"],
        default:"success"
    },
    order_date:{
        type:Date,
        default:new Date
    },
    status:{
        type:String,
        enum:["active", "deleted"],
        default:"active"
    }
})

const transactionModel= mongoose.model("transactions", transactionsSchema)
module.exports= transactionModel