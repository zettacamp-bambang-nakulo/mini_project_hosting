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
        },
        

    }],
    total:{
        type:Number
    },
    order_status:{
        type:String,
        enum:["success", "failed","pending"],
        default:"pending"
    },
    order_date:{
        type:String,
        default:new Date()
    },
    status:{
        type:String,
        enum:["active", "deleted"],
        default:"active"
    }
})

const transactionModel= mongoose.model("transactions", transactionsSchema)
module.exports= transactionModel