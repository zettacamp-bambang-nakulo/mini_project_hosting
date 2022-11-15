const { ApolloError } = require('apollo-server-errors')


async function authRole (resolve, parent, args, context, info){
    const role = context.req.user_id
    console.log(role)
    if(role.role === "user"){
        throw new ApolloError("page not your access")
    }
    return await resolve(parent, args, context, info)
}

module.exports={
    Query:{
        getAllIngredients:authRole
    }
}
