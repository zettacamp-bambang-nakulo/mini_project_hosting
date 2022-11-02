const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: String,
    author: String,
    date_publiched: Number,
    price: Number,
    stock: Number,
},{timestamps:true})

const BookModel= mongoose.model("Books", bookSchema);
module.exports= BookModel;