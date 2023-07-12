const express = require('express')
const router = express.Router()
const uploadController = require('../../controllers/upload')

// 上传
router.post('/avatar', uploadController.upDateAvatar)

module.exports = router
