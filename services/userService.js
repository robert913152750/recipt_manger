const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const JWT = require('jsonwebtoken')

const userService = {
  async signUp (req, res) {
    try {
      if (req.body.password !== req.body.passwordCheck) {
        return res.json({
          status: 'error',
          message: '密碼與確認密碼不同'
        })
      }
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) return res.json({ status: 'error', message: '信箱重複' })

      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      })

      return res.json({
        status: 'success',
        message: '用戶註冊成功'
      })
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  }
}
