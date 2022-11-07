const DataLoader= require("dataloader")
const bookModel= require("./book_Model")


const loadbookshelf= async function(book_ids){
    const listID= await bookModel.find({
        _id:{
            $in: book_ids
        }
    })
   const listMap={}
   listID.forEach((list)=>{
    listMap[list._id]=list
   })
   return book_ids.map(id => listMap[id])
}

const idbooklist= new DataLoader(loadbookshelf)
module.exports= idbooklist