const { ApolloServer, gql}= require("apollo-server");

const typeDefs= gql`
    type user{
        _id:ID
        first_name:String!
        last_name:String!
        email:String!
        password:String
        status:user_status
    }

    enum user_status{
        active
        deleted
    }

    type users{
        data:[user]
        count: Int
        page: Int
        max_page: Int
    }

    type login{
        token:String
    }

    type ingredients{
        id:ID
        name:String,
        stock:Int
        status:user_status
    }

    type Query{
        getAllUser(email:String,page:Int,limit:Int):users
        getOneUser(id:ID, email:String):[user]
        login(email:String,password:String, secret:String):login
        getAllIngredients(stock:Int):[ingredients]
        getOneIngredients(id:ID):ingredients
    }

    type Mutation{
        CreateUser(first_name:String,last_name:String,email:String,password:String):user
        UpdateUser(id:ID,first_name:String,last_name:String,email:String,password:String, status:user_status):user
        DeleteUser(id:ID,status:user_status):user
        CreateIngredints(name:String, stock:Int): ingredients
        UpdateIngredients(id:ID, stock:Int): ingredients
        DeleteIngredients(id:ID,status:user_status):ingredients
    }

`;

module.exports= typeDefs