const { ApolloServer, gql}= require("apollo-server");

const typeDefs= gql`
    type user{
        _id:ID
        first_name:String
        last_name:String
        email:String
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

    enum user_role{
        user
        admin
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

    type recipes{
        id:ID
        recipe_name:String
        ingredients:[ingredientid]
        price:Int
        status:status_recipe
        available:Int
        description:String
        image:String
        menu_highlight:Boolean
        special_offers:Boolean
        discount:Int

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
        _id:ID
        recipe_id:recipes
        amount:Int
        note:String
        total_recipe:Int
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

    type pagination_transactions{
        data_transaction:[transactions]
        count_pending:Int
        count_success: Int
        count_failed:Int
        count_total:Int
        page: Int
        max_page: Int
    }


    type Query{
        getAllUser(email:String,page:Int,limit:Int):users
        getOneUser(id:ID, email:String):[user]

        getAllIngredients(page:Int,limit:Int,name:String,stock:Int,):pagination_ingredients
        getOneIngredients(id:ID):ingredients

        getAllRecipes(page:Int,limit:Int,recipe_name:String,menu_highlight:Boolean,status:status_recipe,special_offers:Boolean):pagination_recipe
        getAllRecipesNoToken(page:Int,limit:Int,recipe_name:String,menu_highlight:Boolean, status:status_recipe,special_offers:Boolean):pagination_recipe
        getOneRecipes(id:ID):recipes

        getAllTransaction(page:Int,limit:Int,last_name_user:String,recipe_name:String,order_status:oder_status):pagination_transactions
        getOneTransaction:transactions
    }

    type Mutation{
        login(email:String,password:String):login

        CreateUser(first_name:String,last_name:String,email:String,password:String,status:all_status,role:user_role):user
        UpdateUser(id:ID,first_name:String,last_name:String,email:String,password:String, status:all_status):user
        DeleteUser(id:ID,status:all_status):user
        
        CreateIngredints(name:String, stock:Int): ingredients
        UpdateIngredients(id:ID,name:String,stock:Int): ingredients
        DeleteIngredients(id:ID):ingredients

        CreateRecipes(recipe_name:String, description:String, image:String, ingredients:[ingredientidinput],status:status_recipe,price:Int,menu_highlight:Boolean,special_offers:Boolean):recipes
        UpdateRecipe(id:ID,recipe_name:String,description:String, image:String, ingredients:[ingredientidinput],price:Int,status:status_recipe,menu_highlight:Boolean,special_offers:Boolean):recipes
        DeleteRecipe(id:ID):recipes

        addCart(menu:[trans_menuInput]): transactions
        DeleteTransaction(id:ID):transactions

        UpdateCart(id:ID,note:String):transactions
        OrderTransaction:transactions
        incrAmaount(menu_id:ID,amount:Int):transactions
        decrAmaount(menu_id:ID,amount:Int):transactions
        deleteCart(id:ID):transactions
    }

`;

module.exports= typeDefs