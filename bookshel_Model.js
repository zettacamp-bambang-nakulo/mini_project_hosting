const mongoose = require('mongoose');

const bookShelfS = mongoose.Schema({
    title: String,
    book_ids: [{
      _id:false,
      list_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'books'
      },
      added:{
        type: Date,
        default: new Date
      },
      stock:{ 
        type:Number
      }
    }],
    date:[{
      date:{
        type: Date
      },
      time:{
        type: String
      }
  
    }]
  });
  
  const bookShelfModel= mongoose.model("bookShelf", bookShelfS);
  module.exports= bookShelfModel;