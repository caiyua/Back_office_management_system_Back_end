const mysql = require('mysql')

//region 数据库配置

const host = '114.132.169.149'
const user = 'root'
const password = '123456'
const database = 'test'

//endregion

const db = mysql.createPool({
	host,
	user,
	password,
	database,
})

module.exports = db
