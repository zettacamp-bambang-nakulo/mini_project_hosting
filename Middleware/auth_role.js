const { ApolloError } = require('apollo-server-errors')
const { Mutation } = require('../resolvers')


async function authRole (resolve, parent, args, context, info){
    const role = context.req.user_id
    if(role.role === "user"){
        throw new ApolloError("page not your access")
    }
    return await resolve(parent, args, context, info)
}

module.exports={
    Query:{
        getAllIngredients:authRole,
    },
    Mutation:{
        CreateIngredints:authRole,
        UpdateIngredients:authRole,
        DeleteIngredients:authRole

    }
}
