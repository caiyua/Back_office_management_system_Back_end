const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user')

// 获取用户自身信息
router.get('/userinfo', userController.queryUserinfo)

// 获取用户自身打卡信息
router.get('/punch-records', userController.queryPunchRecords)

// 添加打卡记录
router.get('/add-records', userController.addPunchRecord)

// 添加用户
router.get('/add-user', userController.addUser)

// 获取用户列表
router.get('/user-list', userController.getUserList)


module.exports = router
