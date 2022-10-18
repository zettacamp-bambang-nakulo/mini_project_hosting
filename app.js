let book = {
    title: "onepice",
    author:"ODA",
    deskripsi:"I want to be the pirate king",
    price: 30000,
    discon:5,
    tax:10,
    sale: true,
    stock:6,
    beli:5,
    totalpricepur:0,
    acutalpur:0,
    credit:10

};

async function purchasebook(book){
    // harga diskon
   const amdiscount= book.price * book.discon / 100 ;

    //harga setelah diskon
    const afterdiscount= book.price - amdiscount;

    //harga pajak
    const amtax= book.tax / 100 * book.price;

    //harga setelah pajak
    const alltax = book.price+amtax;

    //total harga setelah ada diskon dan pajak
    const total =book.price + amtax - amdiscount;

    //total harga semua setalah pembelian
    let  totalpricepur = 0;

    //pembelian asli
    let acutalpur = 0;

    //output hasil data
    console.log("Title:", book.title);
    console.log("Author:", book.author);
    console.log("Discription:",book.deskripsi)
    console.log("Price:", book.price)
    console.log("Stock:",book.stock)
    console.log("Sold:", book.beli)
    console.log("Discount:",book.discon)
    console.log("Amount Of Discount:"+"Rp",amdiscount )
    console.log("After Discount: Rp", afterdiscount)
    console.log("Tax:", book.tax)
    console.log("Status:",book.sale)
    console.log("Amount of Tax: Rp", amtax.toLocaleString("ID"))
    console.log("After Tax:Rp", alltax)
    console.log("Total:Rp", total)

    //jika penjualan true
    if(book.sale == true){
        //perulangan
        for(let i = 1; i <= book.beli; i++){
            totalpricepur= total * i;
            acutalpur-= 1;
            book.stock= book.stock-1;

            if(book.stock > 0){
                console.log("--buku masih bisa dibeli--")
            
            }else{
            console.log("--Buku sudah habis--")
            break;
            }

        console.log("---------------------------")
        console.log("Actual Purchanes:",acutalpur)
        console.log("Stock Update:",book.stock)
        console.log("Total Price:Rp",totalpricepur)

       }  
    }
}
       
       //tentukan cicilan
async function creditbook(addprice=1000){
            //array untuk bulan
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
            let currMonth = 0;

            console.log(`Rincian cicilan ${book.credit} bulan, dimulai dari bulan ${months[currMonth]}`);
            
            // harga cicilan/bulan berdasarkan harga buku terakhir
            let creditPrice = book.price / book.credit;
           
            // Array kosong untuk di push
            let toc = [];

            // var kosong untuk update harga total
            let tocCr = 0;

            // implement desctructuring dan spread
            const [...a] = months;

            // looping for pushing the 
            for (let i = 0; i < book.credit; i++){
                tocCr += creditPrice;

                if(currMonth > 4 ){
                    creditPrice += addprice
                }

                else if (currMonth > 11){
                    currMonth = 0;
                }

                // array func, untuk push ke array object
                toc.push( {
                    bulan: a[currMonth],
                    cicilan: Math.round(creditPrice),
                    total: Math.round(tocCr)
                } );

                //
                currMonth++;
            };

            // console.log([...toc]);
            return toc
     
        }
    


//memangil function
// purchasebook(book);
let arrayCredit= creditbook();
console.log(arrayCredit)
module.exports=creditbook

