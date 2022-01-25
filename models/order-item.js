
const Sequilize = require('sequelize');

const sequelize = require('../utils/database')

const OrderItem = sequelize.define('orderItem',{
  id:{
    type:Sequilize.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
  },
  quantity:Sequilize.INTEGER
});

module.exports = OrderItem