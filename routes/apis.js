const express = require('express')
const passport = require('../config/passport')
const userController = require('../controller/api/userController')
const receiptController = require('../controller/api/receiptController')
const multer = require('multer')
const receiptService = require('../services/receiptService')
const upload = multer({ dest: 'temp/' })
const router = express.Router()

// passport middleware
const authenticated = passport.authenticate('jwt', { session: false })

// router
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/home', authenticated, receiptController.getReceipts)
router.get('/receipt/:id', authenticated, receiptController.getReceipt)
router.post('/receipt', authenticated, upload.single('receipt'), receiptController.uploadReceipt)
router.put('/receipt/:id', authenticated, receiptController.putReceipt)
router.post('/tag', authenticated, receiptController.postTag)
router.put('/tag/:id', authenticated, receiptController.putTag)
router.delete('/tag/:id', authenticated, receiptController.deleteTag)

module.exports = router
