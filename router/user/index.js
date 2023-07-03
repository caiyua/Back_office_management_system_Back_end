const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user')

// 查询用户自身信息接口
router.get('/userinfo', userController.queryUserinfo)

module.exports = router
