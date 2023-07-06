/*
 * 用户模块逻辑汇总
 * */
const jwt = require('jsonwebtoken')
const { jwtSecretKey } = require('../../config/jwtSecretKey')
const db = require('../../config/db')

// 查询用户自身信息-逻辑
exports.queryUserinfo = (req, res) => {
	console.log('user被请求了！')
	// 不需要向数据库发起请求，因为token里面存着请求用户的信息
	const token = req.headers.authorization
	const userinfo = jwt.verify(token.split('Bearer ')[1], jwtSecretKey) // 解析的时候也要把Bearer后面的空格加上
	res.status(200).json({
		status: 200,
		data: { userinfo },
	})
}

// 查询用户自身打卡信息-逻辑
exports.queryPunchRecords = (req, res) => {
	const token = req.headers.authorization
	const { id } = jwt.verify(token.split('Bearer ')[1], jwtSecretKey)
	const queryPunchRecordSql = 'select * from punch_records where user_id=? '
	db.query(queryPunchRecordSql, id, (err, results) => {
		if (err) {
			return res.status(500).json({ status: 500, message: err.message })
		}
		if (results.length < 1) {
			return res.status(204).json({ status: 204 })
		}
		for (let item of results) {
			delete item.id
			delete item.user_id
		}
		res.status(200).json({ status: 200, data: results })
	})
}

// 添加打卡记录-逻辑
exports.addPunchRecord = (req, res) => {
	const { id, punch_in, reason } = req.query
	if (!id && !punch_in && !reason) {
		return res.status(400).json({ status: 400, message: '请传入正确参数' })
	}
	if (id && !punch_in) {
		return res.status(400).json({ status: 400, message: '请传入正确参数' })
	}
	// 打卡成功
	if (id && punch_in && !reason) {
		const addPunchRecordSql =
			'insert into punch_records (user_id, punch_in) value (?,?)'
		db.query(addPunchRecordSql, [id, punch_in], (err, results) => {
			if (err) {
				return res
					.status(500)
					.json({ status: 500, message: err.message })
			}
			return res.status(200).json({ status: 200, data: { results } })
		})
		return
	}
	// 打卡失败
	const addPunchRecordSql =
		'insert into punch_records (user_id, punch_in, reason) value (?,?,?)'
	db.query(addPunchRecordSql, [id, punch_in, reason], (err, results) => {
		if (err) {
			return res.status(500).json({ status: 500, message: err.message })
		}
		res.status(200).json({ status: 200, data: { results } })
	})
}
