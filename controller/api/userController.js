const userService = require('../../services/userService')

const userController = {
  signUp: (req, res) => {
    userService.signUp(req, res, (data) => {
      return res.json(data)
    })
  },
  signIn: (req, res) => {
    userService.signIn(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = userController
