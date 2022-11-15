//manggila apollo serversnya
const { ApolloServer, gql}= require("apollo-server");

//manggil mongoose 
const mongoose= require("mongoose")

//manggil data resolvers yang ada dalam file lain
const Userresolvers= require("./resolvers")

//impor ingredients resolvers
const Ingresolvers= require("./ingredients/ingredient_resolvers")

//memanggil data typedefs yang ada dalam file lain
const typeDefs= require("./typeDef")
const { makeExecutableSchema } = require('@graphql-tools/schema')
const {applyMiddleware} = require ('graphql-middleware')

const authMiddelware= require("./Middleware/auth")

const authRole= require("./Middleware/auth_role")

const {merge}= require("lodash")

//import recipes resolves
const recipeResolvers= require("./recipes/recipe_resolvers")

//import loader ingredients
const ingredientloaders= require("./ingredients/ingredientLoader")

//import loader recipe
const loaderRecepi= require("./recipes/recipesLoader")

//import user loader
const loadUser= require("./userLoader")

//import transactions
const trans_resolvers= require("./transactions/trans_resolvers")


mongoose.connect("mongodb://localhost/restaurant")
const db = mongoose.connection 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() { 
  console.log('connection success'); 
});

const resolvers= merge(
    Userresolvers,
    Ingresolvers,
    recipeResolvers,
    trans_resolvers
)

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaMiddleware = applyMiddleware(schema, authMiddelware, authRole)


const apolloServer= new ApolloServer({
    schema:schemaMiddleware,
    context: function({req}){
        return{
            ingredientloaders,
            loadUser,
            loaderRecepi,
            req
        }
    }
});


apolloServer.listen(3000)
console.log("Running a GraphQL API server at http://localhost:3000/graphql")