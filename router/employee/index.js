const express = require('express')
const router = express.Router()
const employeeController = require('../../controllers/employee')

// 添加员工
router.get('/create', employeeController.createEmployee)

module.exports = router
