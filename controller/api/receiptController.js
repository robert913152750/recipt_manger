const receiptService = require('../../services/receiptService')

const receiptController = {
  uploadReceipt: (req, res) => {
    receiptService.uploadReceipt(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = receiptController
