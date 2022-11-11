const { ApolloError } = require('apollo-server-errors')
const jwt= require("jsonwebtoken");

async function auth (resolve, parent, args, context, info){
    const token = context.req.headers.authorization || ""
    if(!token){
        throw new ApolloError("kamu tidak terauthorisasi")
    }
    jwt.verify(token,"zetta", function(err,decode){
        if(err){
            throw new ApolloError(err)
        }
        context.req.user_id = decode
    })
    return await resolve(parent, args, context, info)
}

module.exports={
    Query:{
        getAllUser:auth,
        getOneUser:auth
    },
    Mutation:{
        CreateUser:auth,
        UpdateUser:auth,
        DeleteUser:auth,
        CreateTransactions:auth
    }
}
