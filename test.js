//GraphQL adalah bahasa kueri untuk API dan runtime untuk memenuhi kueri tersebut dengan data Anda yang ada.
// GraphQL memberikan deskripsi data yang lengkap dan mudah dipahami di API 
//Jika pada REST API ada kita gunakan banyak HTTP request method seperti GET, POST, PUT & DELETE. 
//Pada GraphQL kita hanya menggunakan POST, dengan nama operasi Query & Mutation.
//Untuk mendapatkan data yang memang dibutuhkan dari sebuah REST API kita harus melakukan filtering di sisi client atau membuat endpoint baru.
// Dengan GraphQL kita juga bisa menghindari multiple API calls.
// Sering kita harus mengirim request ke banyak endpoint untuk mendapatkan data yang kita butuhkan. Pada GraphQL kita hanya perlu memanggil endpoint satu kali, bahkan GraphQL hanya memiliki satu endpoint.
// Meskipun tampak jauh lebih simple, tantangan GraphQL ada pada menentukan bentuk GraphQL schema,
const { ApolloServer, gql}= require("apollo-server");
const mongoose= require("mongoose")
const resolvers= require("./resolvers")
const bookloders= require('./bookshelf_loader')
const applyMiddleware=require("graphql-middleware")



mongoose.connect("mongodb://localhost/book")
const db = mongoose.connection 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() { 
  console.log('connection success'); 
});

//GraphQL membagi jenis permintaan API menjadi Query dan Mutations . 
//Kueri tidak mengubah status data dan hanya mengembalikan hasil. Mutasi di sisi lain, memodifikasi data sisi server.
//kueri untuk membaca dan mutasi untuk membuat , memperbarui , atau menghapus
const typeDefs =gql`
type Book{
    id:ID,
    title: String,
    author: String,
    date_publiched: Int,
    price: Int,
    stock: Int,
    total_price:Int,
    price_discount:Int,
    price_tax:Int

}

type BookShelf_bookids{
    list_id: Book
    added:String,
    stock:Int
}

type login{
  status:String
}

type BookShelf{
    title: String,
    book_ids:[BookShelf_bookids]

}
type Query{
    getBooksall(page:Int,limit:Int):[Book]
    getBooksByid(id:ID):Book
    getBookShelfs:[BookShelf]
    login(username:String,password:String, secret:String):login
    auth(token:String):login
}
type Mutation{
    createbook( title: String,
        author: String,
        date_publiched: Int,
        price: String,
        stock: Int):Book

    updatebook(id:ID,title: String,
        author: String,
        date_publiched: Int,
        price: String,
        stock: Int):Book

    deletebook(id:ID):Book
    calculator(discount:Int,tax:Int):[Book]
}
`;
//Tipenya Queryadalah tipe objek khusus yang mendefinisikan semua titik masuk 
//tingkat atas untuk kueri yang dijalankan klien terhadap server

//Resolver adalah kumpulan function yang akan memberi response untuk setiap query GraphQL.
// Response ini dapat berasal dari database atau sebuah string.



const apolloServer= new ApolloServer({
    typeDefs,
    resolvers,
    context: function({}){
        return{
            bookloders
        }
    }
});


apolloServer.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")