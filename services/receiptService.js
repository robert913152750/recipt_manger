const fs = require('fs')
const db = require('../models')
const Receipt = db.Receipt
const ReceiptGoods = db.ReceiptGoods
const Tag = db.Tag
const User = db.User

const receiptService = {
  async uploadReceipt (req, res, callback) {
    try {
      const { file } = req
      fs.readFile(file.path, (err, data) => {
        const receipt = data.toString()
        return callback({
          receipt: receipt
        })
      })
    } catch (err) {
      console.log(err)
      return callback({
        status: 'error',
        message: '上傳失敗'
      })
    }
  }
}

module.exports = receiptService
