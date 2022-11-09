const { ApolloServer, gql}= require("apollo-server");

const typeDefs= gql`
    type user{
        _id:ID
        first_name:String!
        last_name:String!
        email:String!
        password:String
        status:all_status
    }

    enum all_status{
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
        status:all_status
    }
    
    type recipes{
        id:ID
        recipe_name:String
        ingredients:[ingredientid]
        status:all_status
    }

    type ingredientid{
        ingredient_id: ingredients
        stock:Int
    }

    input ingredientidinput{
        ingredient_id:ID
        stock:Int
    }


    type Query{
        getAllUser(email:String,page:Int,limit:Int):users
        getOneUser(id:ID, email:String):[user]

        login(email:String,password:String, secret:String):login

        getAllIngredients(stock:Int):[ingredients]
        getOneIngredients(id:ID):ingredients

        getAllRecipes:[recipes]
        getOneRecipes(id:ID):recipes
    }

    type Mutation{
        CreateUser(first_name:String,last_name:String,email:String,password:String,status:all_status):user
        UpdateUser(id:ID,first_name:String,last_name:String,email:String,password:String, status:all_status):user
        DeleteUser(id:ID,status:all_status):user
        
        CreateIngredints(name:String, stock:Int): ingredients
        UpdateIngredients(id:ID, stock:Int): ingredients
        DeleteIngredients(id:ID,status:all_status):ingredients

        CreateRecipes(recipe_name:String, ingredients:[ingredientidinput],status:all_status):recipes
        UpdateRecipe(id:ID,recipe_name:String, ingredients:[ingredientidinput]):recipes
    }

`;

module.exports= typeDefs