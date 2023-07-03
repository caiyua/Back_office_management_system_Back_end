const express = require('express')
const router = express.Router()
const registerController = require('../../controllers/register')
const expressJoi = require('@escook/express-joi')
const { userCheck } = require('../../utils/check')

// 注册接口
router.post('/register', expressJoi(userCheck), registerController.register)

module.exports = router
