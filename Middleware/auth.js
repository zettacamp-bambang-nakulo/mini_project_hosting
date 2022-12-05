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
        getOneUser:auth,
        getAllIngredients:auth,
        getOneIngredients:auth,
        getAllRecipes:auth,
        getOneRecipes:auth,
        getAllTransaction:auth,
        getHistory:auth,
        getOneTransaction:auth,
        incomingAdmin:auth
    },
    Mutation:{
        UpdateUser:auth,
        DeleteUser:auth,
        CreateIngredints:auth,
        UpdateIngredients:auth,
        DeleteIngredients:auth,
        CreateRecipes:auth,
        UpdateRecipe:auth,
        DeleteRecipe:auth,
        addCart:auth,
        UpdateCart:auth,
        OrderTransaction:auth,
        incrAmaount:auth,
        decrAmaount:auth,
        deleteCart:auth
    }
}
