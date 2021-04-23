const fs = require('fs')
const db = require('../models')
const Receipt = db.Receipt
const ReceiptGoods = db.ReceiptGoods
const Tag = db.Tag
const User = db.User

const receiptService = {
  async uploadReceipt (req, res, callback) {
    try {

    } catch (err) {
      console.log(err)
      callback({
        status: 'error',
        message: '上傳失敗'
      })
    }
  }
}

module.exports = receiptService
