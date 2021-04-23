const express = require('express')
const passport = require('../config/passport')
const userController = require('../controller/api/userController')
const router = express.Router()

// passport middleware
const authenticated = passport.authenticate('jwt', { session: false })

// router
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

module.exports = router
