const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userService = {
  async signUp (req, res, callback) {
    try {
      if (req.body.password !== req.body.passwordCheck) {
        return callback({
          status: 'error',
          message: '密碼與確認密碼不同'
        })
      }
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) return callback({ status: 'error', message: '信箱重複' })

      const password = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: password
      })

      return callback({
        status: 'success',
        message: '用戶註冊成功'
      })
    } catch (err) {
      console.log(err)
      callback({
        status: 'error',
        message: '註冊失敗'
      })
    }
  },
  async signIn (req, res, callback) {
    try {
      if (!req.body.email || !req.body.password) {
        return callback({
          status: 'error',
          message: '請輸入帳號密碼'
        })
      }
      const userEmail = req.body.email
      const password = req.body.password

      const user = await User.findOne({
        where: { email: userEmail }
      })

      if (!user) return callback({ statue: 'error', message: '使用者未註冊' })

      if (!bcrypt.compareSync(password, user.password)) {
        return callback({
          status: 'error',
          message: '密碼錯誤'
        })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)

      return callback({
        status: 'success',
        message: '登入成功',
        token: token,
        user: user
      })
    } catch (err) {
      console.log(err)
      return callback({
        status: 'error',
        message: '登入失敗'
      })
    }
  }
}

module.exports = userService
