const express = require('express')
const router = express.Router()
const loginController = require('../../controllers/login')
const expressJoi = require('@escook/express-joi')
const { userCheck } = require('../../utils/check')

// 登录接口
router.post('/login', expressJoi(userCheck), loginController.login)

module.exports = router
