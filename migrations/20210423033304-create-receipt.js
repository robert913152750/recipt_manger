'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Receipts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      merchant_name: {
        type: Sequelize.STRING
      },
      tel: {
        type: Sequelize.STRING
      },
      gst_reg: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      time: {
        type: Sequelize.DATE
      },
      receipt_id: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.INTEGER
      },
      gst_amount: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Receipts')
  }
}
