const express = require('express')
const userController = require('../controller/api/userController')
const router = express.Router()

// passport middleware

// router
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

module.exports = router
