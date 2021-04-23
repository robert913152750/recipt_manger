const express = require('express')
const passport = require('../config/passport')
const userController = require('../controller/api/userController')
const receiptController = require('../controller/api/receiptController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const router = express.Router()

// passport middleware
const authenticated = passport.authenticate('jwt', { session: false })

// router
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.post('/receipt', authenticated, upload.none(), receiptController.uploadReceipt)

module.exports = router
