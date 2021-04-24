const fs = require('fs')
const moment = require('moment')
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
        if (err) return callback({ status: 'error', message: '上傳失敗' })
        // 根據讀取的結果將資料轉為物件
        const receipt = data.toString().split('\r\n')

        const receiptFirstLimitNumber = receipt.indexOf('+----------------------------------------------+')
        const receiptSecondLimitNumber = receipt.indexOf('', receiptFirstLimitNumber)
        const receiptThirstLimitNumber = receipt.indexOf('--- Thank You & Have A Nice Day ---')

        const receiptBasicInf = receipt.slice(0, receiptFirstLimitNumber)
        const receiptGoodsInf = receipt.slice(receiptFirstLimitNumber + 1, receiptSecondLimitNumber)
        const receiptTotalAndGST = receipt.slice(receiptSecondLimitNumber + 1, receiptThirstLimitNumber)

        let date = Date.parse(receiptBasicInf[4].split(' ')[0].split(':')[1])
        date = moment(date).format('YYYY-MM-DD')

        let time = receiptBasicInf[4].split(' ')[0].split(':')[1] + ' ' + receiptBasicInf[4].split(' ')[2].split('Time:')[1]
        time = Date.parse(time)
        time = moment(time).format('HH:mm:ss')

        const receiptObject = {
          merchant_name: receiptBasicInf[0],
          tel: receiptBasicInf[1].split(':')[1],
          gst_reg: receiptBasicInf[2].split(':')[1],
          date: date,
          time: time,
          receipt_id: parseInt(receiptBasicInf[5].split(':')[1], 10),
          total: parseInt(receiptTotalAndGST[3].split(' ').pop(), 10),
          gst_amount: parseInt(receiptTotalAndGST[5].split(' ').pop(), 10)

        }

        return callback({
          receiptObject
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
