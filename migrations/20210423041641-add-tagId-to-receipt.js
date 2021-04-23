'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Receipts', 'TagId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'Tags',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Receipts', 'TagId')
  }
}
