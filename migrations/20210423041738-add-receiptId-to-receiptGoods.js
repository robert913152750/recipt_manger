'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ReceiptGoods', 'ReceiptId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'Receipt',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ReceiptGoods', 'ReceiptId')
  }
}
