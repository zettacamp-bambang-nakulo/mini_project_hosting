//buat memangil mongoose
const mongoose= require("mongoose")

//untuk membuat shecma
const userSchema= new mongoose.Schema({
    first_name:{
        type:String,
        require:true,
        trim:true
    },
    last_name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: String,
    status:{
        type:String,
        enum:["active", "deleted"],
        default:"active"
    },
    // usertype:[
    //     {
    //         name:String,
    //         view:Boolean
    //     }
    // ]
});

const userModel= mongoose.model("users", userSchema)
module.exports= userModel