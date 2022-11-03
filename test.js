//GraphQL adalah bahasa kueri untuk API dan runtime untuk memenuhi kueri tersebut dengan data Anda yang ada.
// GraphQL memberikan deskripsi data yang lengkap dan mudah dipahami di API 
const { ApolloServer, gql}= require("apollo-server");
const mongoose= require("mongoose")
const bookModel= require("./book_Model")


mongoose.connect("mongodb://localhost/book")
const db = mongoose.connection 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() { 
  console.log('connection success'); 
});

const typeDefs =gql`
type Book{
    id:ID,
    title: String,
    author: String,
    date_publiched: Int,
    price: String,
    stock: Int,

}
type Query{
    getBooksall:[Book]
    getBooksByid(id:ID):[Book]

}`;
//Tipenya Queryadalah tipe objek khusus yang mendefinisikan semua titik masuk 
//tingkat atas untuk kueri yang dijalankan klien terhadap server

//Resolver adalah kumpulan function yang akan memberi response untuk setiap query GraphQL.
// Response ini dapat berasal dari database atau sebuah string.
const resolvers={
    Query:{
        getBooksall:async()=>{
            const book= await bookModel.find()
            return book
        },
        getBooksByid: async(parent, {id})=>{
            if(!id){
                const bookByid= await bookModel.find()
                return bookByid
            }else{
                const bookByid= await bookModel.find({_id:mongoose.Types.ObjectId(id)})
                return bookByid
            }

        }

       
    },
};

const apolloServer= new ApolloServer({
    typeDefs,
    resolvers
});

apolloServer.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")