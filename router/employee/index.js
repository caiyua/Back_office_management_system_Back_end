const express = require('express')
const router = express.Router()
const employeeController = require('../../controllers/employee')
// const multer = require('multer')
// const { USER_AVATAR } = require('../../config/constant')

// // 创建 Multer 实例，指定文件存储目录和文件名等配置
// const storage = multer.diskStorage({
// 	destination: USER_AVATAR, // 上传文件存储目录
// 	filename: (req, file, cb) => {
// 		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
// 		const originalName = file.originalname
// 		const fileExtension = originalName.substring(originalName.lastIndexOf('.')) // 保留原始文件的扩展名
// 		cb(null, `${uniqueSuffix}${fileExtension}`)
// 	},
// })
//
// // 创建 Multer 中间件
// const upload = multer({ storage })

// 添加员工
router.post('/create', employeeController.createEmployee)

module.exports = router
