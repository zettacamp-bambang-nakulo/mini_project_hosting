const { ApolloServer, gql}= require("apollo-server");

const typeDefs= gql`
    type user{
        _id:ID
        first_name:String!
        last_name:String!
        email:String!
        password:String
        role:user_role
        status:all_status
        usertype:[user_type]
    }

    enum all_status{
        active
        deleted
    }

    type user_type{
        name:String
        slug:String
        icon_name:String
        view:Boolean
    }

    type users{
        data:[user]
        count: Int
        page: Int
        max_page: Int
    }

    type login{
        token:String
        id:ID
        first_name:String
        last_name:String
        email:String
        password:String
        role:user_role
        status:all_status
        usertype:[user_type]

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
        price:Int
        status:status_recipe
        available:Int
        description:String
        image:String

    }

    enum status_recipe{
        publish
        unpublish
        deleted
    }

    type pagination_recipe{
        data_recipes:[recipes]
        count_publish: Int
        count_unpublish:Int
        count_deleted:Int
        count_total:Int
        page: Int
        max_page: Int
    }

    type ingredientid{
        ingredient_id: ingredients
        stock_used:Int
    }
    type pagination_ingredients{
        data:[ingredients]
        count_active: Int
        count_deleted:Int
        count_total:Int
        page: Int
        max_page: Int
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
        total:Int
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
        pending
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

        getAllIngredients(page:Int,limit:Int,stock:Int):pagination_ingredients
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
        UpdateIngredients(id:ID,name:String,stock:Int): ingredients
        DeleteIngredients(id:ID):ingredients

        CreateRecipes(recipe_name:String, description:String, image:String, ingredients:[ingredientidinput],status:status_recipe,price:Int):recipes
        UpdateRecipe(id:ID,recipe_name:String,description:String, image:String, ingredients:[ingredientidinput],price:Int,status:status_recipe):recipes
        DeleteRecipe(id:ID,status:status_recipe):recipes

        CreateTransactions(menu:[trans_menuInput]): transactions
        DeleteTransaction(id:ID):transactions

        addCart(id:ID,menu:[trans_menuInput]):transactions
        deleteCart(id:ID):transactions
    }

`;

module.exports= typeDefs