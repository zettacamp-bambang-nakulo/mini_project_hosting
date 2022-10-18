//array objek
const songs = [
    {
        title :"Interaksi",
        artist: "Tulus",
        genre :"Pop",
        duration:10.54
    },
    {
        title :"Butter",
        artist: "BTS",
        genre :"Kpop",
        duration:10.54
    },
    {
        title :"Terlukis Indah",
        artist: "Riski Febian",
        genre :"Pop",
        duration:10.48
    },
    {
        title :"Venom",
        artist: "Black Pink",
        genre :"Kpop",
        duration:10.08
    },
    {
        title :"Pesan Terakhir",
        artist: "Lyodra",
        genre :"Pop",
        duration:10.22
    },
    {
        title :"Pop!",
        artist: "Naeyon",
        genre :"Kpop",
        duration:10.51
    },
    {
        title :"Hadapi Berdua",
        artist: "Tiara Andini",
        genre :"Pop",
        duration:10.56
    },
    {
        title :"The Feels",
        artist: "Twice",
        genre :"Kpop",
        duration:10.52
    },
    {
        title :"Bisa Tanpamu",
        artist: "Andmesh",
        genre :"Pop",
        duration:10.11
    },
    {
        title :"First Love",
        artist: "After School",
        genre :"Kpop",
        duration:10.41
    }
];

function sortByGenre(data, genre) {
    // bikin reference baru
    // biar nggak ada side effect
    const songs = data;
    
    // sort pake array method .sort()
    const sorted = songs.filter(song => {
        // return boolean
        return song.genre == genre;
    });
    
    return sorted;
}

function sortByArtist(data, artist) {
    // bikin reference baru
    const songs = data;
    
    // sort pake array method .sort()
    const sorted = songs.filter(song => {
        // return boolean
        return song.artist == artist;
    });
    
    return sorted;
}

function generateRandomPlaylist(data) {
    // bikin reference baru
    const songs = data;
    
    // buat nampung output
    const output = {
        duration: 0,
        playlist: []
    };
    
    //Able to do iteration on array of object
    while(true) {
        // random number
        const rnum = getRandomNumber(0, songs.length - 1);
       
        // ngambil data dari array pake random 
        
        const [song] = songs.splice(rnum, 1);
        
        // buat ngecek lagunya udah masuk playlist apa belum
        //Able to use condition statement
        if (!song) continue;
        
        // kalo setelah ditambah durasinya ternyata
        // lebih dari 60 menit. udah stop. kalo ngga ya lanjut
        if ((output.duration + song.duration) > 60) break;
        
        // push song ke output.playlist
        output.playlist.push(song);
        
        // sama increment total durasinya.
        output.duration += song.duration;
    } 
    
    return output;
}

// helper buat dapetin angka random
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//function dimasukan ke variable
const genreSorted = sortByGenre(songs, "Pop");
const artistSorted = sortByArtist(songs, "BTS");
const randomPlaylist = generateRandomPlaylist(songs);

//memangil function dalam console.log
console.log("sorted genre:", genreSorted);
console.log("sorted artist:", artistSorted);
console.log("random playlist:", randomPlaylist);