
const Sequilize = require('sequelize');

const sequelize = require('../utils/database')

const CartItem = sequelize.define('cartItem',{
  id:{
    type:Sequilize.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
  },
  quantity:Sequilize.INTEGER
});

module.exports = CartItem;