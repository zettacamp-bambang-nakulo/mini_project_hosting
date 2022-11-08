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

    type login{
        token:String
    }

    type ingredients{
        id:ID
        name:String,
        stock:Int
        status:String
    }

    type Query{
        getAllUser(email:String):[user]
        getOneUser(id:ID, email:String):[user]
        login(email:String,password:String, secret:String):login

    }

    type Mutation{
        CreateUser(first_name:String,last_name:String,email:String,password:String):user
        UpdateUser(id:ID,first_name:String,last_name:String,email:String,password:String, status:user_status):user
        DeleteUser(id:ID, status:String):user
        CreateIngredints(name:String, stock:Int): ingredients
    }

`;

module.exports= typeDefs