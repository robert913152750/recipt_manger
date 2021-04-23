'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Receipt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Receipt.hasMany(models.ReceiptGoods)
      Receipt.belongsTo(models.User)
      Receipt.belongsTo(models.Tag)
    }
  };
  Receipt.init({
    merchant_name: DataTypes.STRING,
    tel: DataTypes.STRING,
    gst_reg: DataTypes.STRING,
    date: DataTypes.DATE,
    time: DataTypes.DATE,
    receipt_id: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    gst_amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Receipt'
  })
  return Receipt
}
