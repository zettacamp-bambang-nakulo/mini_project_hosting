const { ApolloServer, gql}= require("apollo-server");


const typeDefs =gql`
    type song{
        id:ID,
        title :String,
        artist: String,
        genre :String,
        duration:String
    }

    type Songs{
        data:[song]
        count: Int
        page: Int
        max_page: Int
    }
    type login{
        status:String
    }

    type playlist{
        id:ID
        title:String
        song_list:[list_id]
    }

    type list_id{
        song_id:song
    }

    type User{
        id:ID
        username: String,
        password: String,
        role : String,
        active: Boolean
    }

    type Query{
        getsongs(page:Int, limit:Int):Songs
        getsongsByid(id:ID):song
        getplaylist:[playlist]
        getplaylistId(id:ID):playlist
        login(username:String,password:String, secret:String):login
        auth(token:String):login
        getUsers:[User]
        
    }
    type Mutation{
        createSong(title:String, artist:String,genre:String,duration:String):song
        updateSong(id:ID,title:String, artist:String,genre:String,duration:String):song,
        deleteSong(id:ID):song
        createplaylist(song_list:ID,title:String):playlist
        updateplaylist(song_list:ID, title:String):playlist
        deleteplaylist(id:ID):playlist
        register(username: String,password: String,role : String,active: Boolean):User
    }

`;

module.exports= typeDefs