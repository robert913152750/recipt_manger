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
router.post('/receipt', authenticated, upload.single('receipt'), receiptController.uploadReceipt)

module.exports = router
