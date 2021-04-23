const express = require('express')
const userController = require('../controller/api/userController')
const router = express.Router()

// passport middleware

// router
router.post('/signup', userController.signUp)

module.exports = router
