const DataLoader= require("dataloader")
const userModel= require("./userModel")

const loadUser= async function(user_id){
    const UserID= await userModel.find({
        _id:{
            $in: user_id
        }
    })
   const UserMap={}
   UserID.forEach((list)=>{
    UserMap[list._id]=list
   })
   return user_id.map(id => UserMap[id])
}

const loderUser= new DataLoader(loadUser)
module.exports= loderUser