'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ReceiptGoods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      ReceiptGoods.belongsTo(models.Receipt)
    }
  };
  ReceiptGoods.init({
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReceiptGoods'
  })
  return ReceiptGoods
}
