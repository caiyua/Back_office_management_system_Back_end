/*
 * 用户模块逻辑汇总
 * */
const jwt = require('jsonwebtoken')
const { jwtSecretKey } = require('../../config/jwtSecretKey')
const db = require('../../config/db')

// 获取用户自身信息-逻辑
exports.queryUserinfo = (req, res) => {
	console.log('user被请求了！')
	// 不需要向数据库发起请求，因为token里面存着请求用户的信息
	const token = req.headers.authorization
	const userinfo = jwt.verify(token.split('Bearer ')[1], jwtSecretKey) // 解析的时候也要把Bearer后面的空格加上
	const dateOfBirth = new Date(userinfo.date_of_birth)
	userinfo.date_of_birth = dateOfBirth
		.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
		.substring(0, 8)
	const onBoardTime = new Date(userinfo.on_board_time)
	userinfo.on_board_time = onBoardTime
		.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
		.substring(0, 8)
	res.status(200).json({
		status: 200,
		data: { userinfo },
	})
}

// 获取用户自身打卡信息-逻辑
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
			// 转换为北京时间
			const date = new Date(item.date)
			item.date = date.toLocaleString('zh-CN', {
				timeZone: 'Asia/Shanghai',
			})
		}
		res.status(200).json({ status: 200, data: results })
	})
}

// 添加打卡记录-逻辑
exports.addPunchRecord = (req, res) => {
	let { id, punch_in, reason } = req.query
	console.log(id, punch_in)
	/*
	 * 判空
	 * */
	if (id === undefined)
		return res.status(400).json({ status: 400, message: '请传入正确参数（id）' })
	if (punch_in === undefined)
		return res.status(400).json({ status: 400, message: '请传入正确参数（punch_in）' })

	/*
	 * 转换类型
	 * */
	if (typeof id !== 'number') id = parseFloat(id)
	if (typeof punch_in !== 'number') punch_in = parseFloat(punch_in)
	if (typeof reason === 'undefined') reason = ''
	if (typeof reason !== 'string') reason = reason.toString()

	// 打卡成功 || 传原因
	if (punch_in === 1 && reason.length > 0) {
		return res.status(400).json({
			status: 400,
			message: '请传入正确参数（punch_in === 1 则不能传reason）',
		})
	}

	// 获取当前时间
	const currentTime = new Date()
	// 使用本地时间
	const localTime = currentTime.toLocaleString()
	// 打卡失败
	if (punch_in === 0) {
		console.log('打卡失败')
		const addPunchRecordSql =
			'insert into punch_records (user_id, punch_in, reason, date) value (?,?,?,?)'
		db.query(addPunchRecordSql, [id, punch_in, reason, localTime], (err, results) => {
			if (err) {
				return res.status(500).json({ status: 500, message: err.message })
			}
			return res.status(200).json({
				status: 200,
				message: '未打卡',
				data: { results },
			})
		})
		return
	}
	// 打卡成功
	if (punch_in === 1) {
		const addPunchRecordSql =
			'insert into punch_records (user_id, punch_in, date) value (?,?, ?)'
		db.query(addPunchRecordSql, [id, punch_in, localTime], (err, results) => {
			if (err) {
				return res.status(500).json({ status: 500, message: err.message })
			}
			console.log('打卡成功')
			return res.status(200).json({
				status: 200,
				message: '打卡成功',
				data: { results },
			})
		})
	}
}
