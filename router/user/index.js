const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user')

// 查询用户自身信息-接口
router.get('/userinfo', userController.queryUserinfo)

// 查询用户自身打卡信息-接口
router.get('/punch-records', userController.queryPunchRecords)

// 添加打卡记录-接口
router.get('/add-records', userController.addPunchRecord)

module.exports = router
