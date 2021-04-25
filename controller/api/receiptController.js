const receiptService = require('../../services/receiptService')

const receiptController = {
  uploadReceipt: (req, res) => {
    receiptService.uploadReceipt(req, res, (data) => {
      return res.json(data)
    })
  },
  getReceipts: (req, res) => {
    receiptService.getReceipts(req, res, (data) => {
      return res.json(data)
    })
  },
  getReceipt: (req, res) => {
    receiptService.getReceipt(req, res, (data) => {
      return res.json(data)
    })
  },
  putReceipt: (req, res) => {
    receiptService.putReceipt(req, res, (data) => {
      return res.json(data)
    })
  },
  postTag: (req, res) => {
    receiptService.postTag(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = receiptController
