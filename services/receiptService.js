const fs = require('fs')
const moment = require('moment')
const util = require('util')
const promisify = util.promisify
const db = require('../models')
const Receipt = db.Receipt
const ReceiptGoods = db.ReceiptGoods
const Tag = db.Tag
const User = db.User

const receiptService = {
  async uploadReceipt (req, res, callback) {
    try {
      const readFile = promisify(fs.readFile)
      const { file } = req

      let receipt = await readFile(file.path)
      receipt = receipt.toString().split('\r\n')

      // 根據讀取的結果將資料轉為物件
      const receiptFirstLimitNumber = receipt.indexOf('+----------------------------------------------+')
      const receiptSecondLimitNumber = receipt.indexOf('', receiptFirstLimitNumber)
      const receiptThirstLimitNumber = receipt.indexOf('--- Thank You & Have A Nice Day ---')

      const receiptBasicInf = receipt.slice(0, receiptFirstLimitNumber)
      const receiptGoodsInf = receipt.slice(receiptFirstLimitNumber + 1, receiptSecondLimitNumber)
      const receiptTotalAndGST = receipt.slice(receiptSecondLimitNumber + 1, receiptThirstLimitNumber)

      let date = receiptBasicInf[4].split(' ')[0].split(':')[1].split('.')
      let time = `${date[2]}.${date[1]}.${date[0]}` + ' ' + receiptBasicInf[4].split(' ')[2].split('Time:')[1]

      date = Date.parse(`${date[2]}.${date[1]}.${date[0]}`)
      date = moment(date).format('YYYY-MM-DD')

      time = Date.parse(time)
      time = moment(time).format('YYYY-MM-DD HH:mm:ss')

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

      const receiptGoodsObjects = []
      class Goods {
        constructor (name, quantity, amount, total) {
          this.name = name,
          this.quantity = quantity,
          this.amount = amount,
          this.total = total
        }
      }

      for (let i = 0; i < receiptGoodsInf.length; i++) {
        let name = ''
        let quantity = 0
        let amount = 0
        let total = 0
        if (i % 2 !== 0) {
          name = receiptGoodsInf[i - 1]
          quantity = parseInt(receiptGoodsInf[i].split(' x')[0], 10)
          amount = parseFloat(receiptGoodsInf[i].split(' ')[2])
          total = parseFloat(receiptGoodsInf[i].split(' ').pop())
          receiptGoodsObjects.push(new Goods(name, quantity, amount, total))
        }
      }

      const newReceipt = await Receipt.create({
        merchant_name: receiptObject.merchant_name,
        tel: receiptObject.tel,
        gst_reg: receiptObject.gst_reg,
        date: receiptObject.date,
        time: receiptObject.time,
        receipt_id: receiptObject.receipt_id,
        total: receiptObject.total,
        gst_amount: receiptObject.gst_amount,
        UserId: Number(req.user.dataValues.id)
      })

      for (let i = 0; i < receiptGoodsObjects.length; i++) {
        await ReceiptGoods.create({
          name: receiptGoodsObjects[i].name,
          quantity: receiptGoodsObjects[i].quantity,
          amount: receiptGoodsObjects[i].amount,
          total: receiptGoodsObjects[i].total,
          ReceiptId: newReceipt.id
        })
      }

      return callback({
        newReceipt,
        receiptGoodsObjects
      })
    } catch (err) {
      console.log(err)
      return callback({
        status: 'error',
        message: '上傳失敗'
      })
    }
  },
  async getReceipts (req, res, callback) {
    try {
      const pageLimit = 10
      const UserId = Number(req.user.dataValues.id)
      let offset = 0
      const whereQuery = {}
      let TagId = ''

      if (req.query.page) {
        offset = (req.query.page - 1) * pageLimit
      }

      if (req.query.TagId) {
        TagId = req.query.TagId
        whereQuery.TagId = TagId
      }

      const receipts = await Receipt.findAndCountAll({
        include: [
          { model: ReceiptGoods }
        ],
        where: [
          { UserId: UserId }
        ],
        offset: offset,
        limit: pageLimit
      })

      const tags = await Tag.findAll()

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(receipts.count / pageLimit)
      const totalPage = Array.from({ length: pages }, (item, index) => index + 1)

      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      return callback({
        receipts: receipts,
        tags,
        page,
        TagId,
        totalPage,
        prev,
        next
      })
    } catch (err) {
      console.log(err)
      return callback({
        status: 'error',
        message: 'something wrong'
      })
    }
  },
  async getReceipt (req, res, callback) {
    try {
      const receipt = await Receipt.findByPk(req.params.id, {
        include: [
          { model: Tag }
        ]
      })
      const tags = await Tag.findAll()
      return callback({ receipt, tags })
    } catch (err) {
      console.log(err)
      return callback({
        status: 'error',
        message: '發生錯誤'
      })
    }
  },
  async putReceipt (req, res, callback) {
    try {
      const { TagId } = req.body
      const receipt = await Receipt.findByPk(req.params.id)

      await receipt.update({
        TagId
      })

      return callback({
        status: 'success',
        message: '新增標籤成功'
      })
    } catch (err) {
      console.log(err)
      return callback({
        status: 'error',
        message: '更改失敗'
      })
    }
  },
  async postTag (req, res, callback) {
    try {
      const { tagName } = req.body
      const UserId = Number(req.user.dataValues.id)
      const checkTagName = await Tag.findAll({
        where: [
          { name: tagName }
        ]
      })

      if (checkTagName) {
        return callback({
          status: 'error',
          message: '名稱重複'
        })
      }

      const tag = await Tag.create({
        name: tagName,
        UserId: UserId

      })
      return callback({
        status: 'success',
        message: '新增標籤成功',
        tag
      })
    } catch (err) {
      console.log(err)
      return callback({
        status: 'error',
        message: '新增標籤失敗'

      })
    }
  }

}

module.exports = receiptService
