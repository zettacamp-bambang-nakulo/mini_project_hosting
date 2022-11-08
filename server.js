//manggila apollo serversnya
const { ApolloServer, gql}= require("apollo-server");

//manggil mongoose 
const mongoose= require("mongoose")

//manggil data resolvers yang ada dalam file lain
const resolvers= require("./resolvers")

//memanggil data typedefs yang ada dalam file lain
const typeDefs= require("./typeDef")
const { makeExecutableSchema } = require('@graphql-tools/schema')
const {applyMiddleware} = require ('graphql-middleware')
const authMiddelware= require("./auth")


mongoose.connect("mongodb://localhost/restaurant")
const db = mongoose.connection 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() { 
  console.log('connection success'); 
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaMiddleware = applyMiddleware(schema, authMiddelware)


const apolloServer= new ApolloServer({
    schema:schemaMiddleware,
    context: function({req}){
        return{
            req:req
        }
    }
});


apolloServer.listen(3000)
console.log("Running a GraphQL API server at http://localhost:3000/graphql")