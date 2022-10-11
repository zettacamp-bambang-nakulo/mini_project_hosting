function  bookpurchasing(title, author,deskripsi, price, dicount, tax, sale){
    
    const ti = title;
    const aut= author;
    const des= deskripsi;
    
    let pri=price;

    // diskon/
    const dis= dicount;
    let amoundis= price * dicount

    // after dicount
    const priceall= price -amoundis;

    // Amount of tax
    const t= tax;

    // Price after tax
    const taxaff=price*tax /100
    
    const sal= sale;
    
    console.log("title:",ti)
    console.log("author:", aut)
    console.log("deskripsi:",des)
    console.log("price:","Rp.", price)
    console.log("dicount:",dis,"%")
    console.log("tax:",t,"%")
    console.log("total diskon:"+" Rp.", amoundis);
    console.log("Total:"+"Rp.",priceall)
    console.log("total tax:", taxaff)
    console.log("sale :", sale )





}
bookpurchasing("oke", "saya","javascrip day 1 zettacamp", 20000, 0.1, 50, true,);

