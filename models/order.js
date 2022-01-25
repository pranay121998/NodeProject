
const Sequilize = require('sequelize');

const sequelize = require('../utils/database')

const Order = sequelize.define('order',{
  id:{
    type:Sequilize.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
  }
});

module.exports = Order;