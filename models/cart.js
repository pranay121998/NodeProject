
const Sequilize = require('sequelize');

const sequelize = require('../utils/database')

const Cart = sequelize.define('cart',{
  id:{
    type:Sequilize.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
  }
});

module.exports = Cart;