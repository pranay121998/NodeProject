const Sequelize = require('sequelize');

const sequelize = require('../utils/database')

const Product = sequelize.define('product',{
  id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
  },
  title:{
    type:Sequelize.STRING,
    allowNull:false
  },
  imageUrl:{
    type:Sequelize.STRING,
    allowNull:false
  },
  description: Sequelize.STRING,
  price:{
    type:Sequelize.DOUBLE,
    allowNull:false
  }
});

module.exports= Product;