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

    type pagination_recipe{
        data:[recipes]
        count: Int
        page: Int
        max_page: Int
    }

    type ingredientid{
        ingredient_id: ingredients
        stock_used:Int
    }

    input ingredientidinput{
        ingredient_id:ID
        stock_used:Int
    }

    type transactions{
        id:ID
        user_id:user
        menu:[trans_menu]
        order_status:oder_status
        order_date:String
        status:all_status
    
    }

    type trans_menu{
        recipe_id:recipes
        amount:Int
        note:String
    }

    type populate{
        transa_populate:String
    }

    enum oder_status{
        success
        failed
    }

    input trans_menuInput{
        recipe_id:ID
        amount:Int
        note:String
        
    }

    enum user_role{
        user
        admin
    }


    type Query{
        getAllUser(email:String,page:Int,limit:Int):users
        getOneUser(id:ID, email:String):[user]

        getAllIngredients(page:Int,limit:Int,stock:Int):[ingredients]
        getOneIngredients(id:ID):ingredients

        getAllRecipes(page:Int,limit:Int):pagination_recipe
        getOneRecipes(id:ID):recipes

        getAllTransaction(page:Int,limit:Int,last_name_user:String,recipe_name:String,order_status:oder_status):[transactions]
        getOneTransaction(id:ID):transactions
    }

    type Mutation{
        login(email:String,password:String):login

        CreateUser(first_name:String,last_name:String,email:String,password:String,status:all_status,role:user_role):user
        UpdateUser(id:ID,first_name:String,last_name:String,email:String,password:String, status:all_status):user
        DeleteUser(id:ID,status:all_status):user
        
        CreateIngredints(name:String, stock:Int): ingredients
        UpdateIngredients(id:ID, stock:Int): ingredients
        DeleteIngredients(id:ID,status:all_status):ingredients

        CreateRecipes(recipe_name:String, ingredients:[ingredientidinput],status:all_status):recipes
        UpdateRecipe(id:ID,recipe_name:String, ingredients:[ingredientidinput]):recipes
        DeleteRecipe(id:ID,status:all_status):recipes

        CreateTransactions(menu:[trans_menuInput],order_date:String): transactions
        DeleteTransaction(id:ID):transactions
    }

`;

module.exports= typeDefs