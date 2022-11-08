const { ApolloServer, gql}= require("apollo-server");
const mongoose= require("mongoose")
const resolvers= require("./resolvers")
const songloders= require('./song_loader')
const typeDefs= require("./typedef")




mongoose.connect("mongodb://localhost/book")
const db = mongoose.connection 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() { 
  console.log('connection success'); 
});

const apolloServer= new ApolloServer({
    typeDefs,
    resolvers,
    context: function({req}){
        return{
            songloders,
            req
        }
    }
});


apolloServer.listen(5000)
console.log("Running a GraphQL API server at http://localhost:5000/graphql")