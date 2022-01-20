const db = require('../utils/database');

const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

 

  save(prodId) {
    if(prodId){
      return db.execute(`SELECT * FROM product where id=${prodId}`).then(([row,fieldData])=>{
      console.log("rows    ",row[0])
      if(row[0]){
        db.execute(`UPDATE product 
        SET title=?,price=?,imageUrl=?,description=? 
        where id=${prodId}`,[
          this.title, this.price,this.imageUrl,this.description
        ])
      }else{
        db.execute('INSERT INTO product (title,price,imageUrl,description) VALUES (?,?,?,?)', [
          this.title,this.price,this.imageUrl,this.description
        ])
      }

    }).catch(err=>console.log(err))
  }else{
   return db.execute('INSERT INTO product (title,price,imageUrl,description) VALUES (?,?,?,?)', [
      this.title,this.price,this.imageUrl,this.description
    ])
  }
   
  }

  static deleteById(id){
    return db.execute(`DELETE FROM product WHERE id=${id}`) 
  }

  static fetchAll() {
    return db.execute('SELECT * FROM product')
  }

  static findById(id) {
    return db.execute(`SELECT * FROM product where id=${id}`)
  }
};