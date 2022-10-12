function  bookpurchasing(title, author,deskripsi, price, dicount, tax, sale, stock, jumlah){
    
    const ti = title;
    const aut= author;
    const des= deskripsi;
    
    let pri=price;

    // diskon/
    const dis= dicount;
    let amoundis= pri * dicount

    // after dicount
    const priceall= pri -amoundis;

    // Amount of tax
    const t= tax;

    // Price after tax
    const taxaff=pri*tax /100
    
    const sal= sale;

    let st= stock;
    let jum= jumlah;

    console.log("title:",ti)
    console.log("author:", aut)
    console.log("deskripsi:",des)
    console.log("price:","Rp.", price.toLocaleString("ID"))
    console.log("dicount:",dis,"%")
    console.log("tax:",t,"%")
    console.log("total diskon:"+" Rp.", amoundis.toLocaleString("ID"));
    console.log("Total:"+"Rp.",priceall.toLocaleString("ID"))
    console.log("total tax:", taxaff.toLocaleString("ID"))
    console.log("sale :", sale )
    
    for (let i = 1; i <=jumlah; i++) {
            jumst= pri * i;
            console.log("-----------------------")
            console.log("barang yang dibeli",);
            console.log("-----------------------")

            
            
            stock= stock-1;
            jum-=1
            console.log("jumlah:", jum)
            console.log("total price:",jumst.toLocaleString("ID"))
            console.log("stock Update:",stock)
            if(stock > 0){
                console.log("--buku masih bisa dibeli--")  
            } else{
                console.log("--Buku sudah habis--")
                break;

            }
        }
        







}
bookpurchasing("oke", "saya","javascrip day 1 zettacamp", 20000, 0.1, 50, true,5,6);