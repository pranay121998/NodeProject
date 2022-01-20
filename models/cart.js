const db = require('../utils/database')

const Product = require('./product')

module.exports = class Cart {
  static addProduct(id, productPrice) {

    db.execute(`SELECT * FROM cart where prodId=${id}`).then(([row,fieldData])=>{
      console.log("rows    ",row[0])
      if(row[0]){
        db.execute(`UPDATE cart 
        SET prodId=${id},qty = ${row[0].qty}+${1},prodPrice=${productPrice} 
        where prodId=${id}`)
      }else{
        db.execute(`INSERT INTO cart (qty,prodPrice,prodId) 
        VALUES (${1},${productPrice},${id})`)
      }

    }).catch(err=>console.log(err))

    // fs.readFile(p, (err, filecontent) => {
    //   let cart = { products: [], totalPrice: 0 };
    //   if (!err) {
    //     cart = JSON.parse(filecontent);
    //   }
    //   console.log(cart.products.findIndex((p) => p.id == id));

    //   const existingProductIndex = cart.products.findIndex((p) => p.id == id);
    //   const existingProduct = cart.products[existingProductIndex];
    //   let updatedProduct;
    //   if (existingProduct) {
    //     updatedProduct = { ...existingProduct };
    //     updatedProduct.qty = updatedProduct.qty + 1;
    //     cart.products = [...cart.products];
    //     cart.products[existingProductIndex] = updatedProduct;
    //   } else {
    //     updatedProduct = { id: id, qty: 1 };
    //     cart.products = [...cart.products, updatedProduct];
    //   }

    //   cart.totalPrice = cart.totalPrice + +productPrice;
    //   fs.writeFile(p, JSON.stringify(cart), (err) => {
    //     console.log(err);
    //   });
    // });
  }

  static deleteProduct(id){
          
    return db.execute(`DELETE FROM cart WHERE prodId=${id}`)

    // fs.readFile(p, (err, filecontent) => {
    //     if(err){
    //         return;
    //     }
    //     const updatedCart ={...JSON.parse(filecontent) }
    //     console.log("dfds ",updatedCart)
    //     const product = updatedCart.products.find(p => p.id === id)
    //     if(!product){
    //       return;
    //     }
    //     const productQty = product.qty;
    //     updatedCart.products = updatedCart.products.filter(p => p.id !== id) 
    //     updatedCart.totalPrice =updatedCart.totalPrice - productPrice * productQty;
       
    //     fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
    //         console.log(err);
    //       });

    // });

  }

  static getCart(){
    // return db.execute('SELECT * FROM cart');
    return db.execute(`SELECT * FROM product JOIN cart on product.id = cart.prodId`)
    
  }
};
