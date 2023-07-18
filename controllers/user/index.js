/*
 * 用户模块逻辑汇总
 * */
const jwt = require('jsonwebtoken')
const { jwtSecretKey } = require('../../config/jwtSecretKey')
const db = require('../../config/db')
const path = require('path')

/*
 * 获取用户自身信息
 * */
exports.queryUserinfo = (req, res) => {
	console.log('user被请求了！')
	// 不需要向数据库发起请求，因为token里面存着请求用户的信息
	const token = req.headers.authorization
	const userinfo = jwt.verify(token.split('Bearer ')[1], jwtSecretKey) // 解析的时候也要把Bearer后面的空格加上
	const dateOfBirth = new Date(userinfo.date_of_birth)
	userinfo.date_of_birth = dateOfBirth.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }).substring(0, 8)
	const onBoardTime = new Date(userinfo.on_board_time)
	userinfo.on_board_time = onBoardTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }).substring(0, 8)
	res.status(200).json({
		status: 200,
		data: { userinfo },
	})
}

/*
 * 获取用户自身打卡信息
 * */
exports.queryPunchRecords = (req, res) => {
	const token = req.headers.authorization
	const { id } = jwt.verify(token.split('Bearer ')[1], jwtSecretKey)
	const queryPunchRecordSql = 'select * from punch_records where user_id=? '
	db.query(queryPunchRecordSql, id, (err, results) => {
		if (err) {
			return res.status(500).json({ status: 500, message: err.message })
		}
		if (results.length < 1) {
			return res.status(204).json({ status: 204, message: '暂无打卡信息' })
		}
		for (let item of results) {
			delete item.id
			delete item.user_id
			// 转换为北京时间
			// 假设item.date是一个字符串类型的时间，格式为：2023/7/18 13:19:31
			// 将字符串时间转换成Date对象
			let originalDate = new Date(item.date)
			// 增加8个小时
			originalDate.setHours(originalDate.getHours() + 8)
			// 将结果转换为北京时间格式字符串：yyyy/MM/dd HH:mm:ss
			item.date = originalDate.toLocaleString('zh-CN', {
				timeZone: 'Asia/Shanghai',
			})
		}
		res.status(200).json({ status: 200, data: results })
	})
}

/*
 * 添加打卡记录
 * */
exports.addPunchRecord = (req, res) => {
	let { id, punch_in, reason } = req.query
	console.log(id, punch_in)

	/*
	 * 判空
	 * */
	if (!id) return res.status(400).json({ status: 400, message: '请传入正确参数（id）' })
	if (punch_in === undefined) return res.status(400).json({ status: 400, message: '请传入正确参数（punch_in）' })

	/*
	 * 转换类型
	 * */
	id = parseInt(id)
	punch_in = parseInt(punch_in)

	if (reason === undefined) reason = ''
	reason = String(reason)

	// 打卡成功 || 传原因
	if (punch_in === 1 && reason.length > 0) {
		return res.status(400).json({
			status: 400,
			message: '请传入正确参数（punch_in === 1 则不能传reason）',
		})
	}

	// 打卡失败或打卡成功
	const addPunchRecordSql = 'INSERT INTO punch_records (user_id, punch_in, reason) VALUES (?,?,?)'
	db.query(addPunchRecordSql, [id, punch_in, reason], (err, results) => {
		if (err) {
			return res.status(500).json({ status: 500, message: err.message })
		}

		if (punch_in === 0) {
			console.log('打卡失败')
			return res.status(200).json({
				status: 200,
				message: '未打卡',
				data: { results },
			})
		} else if (punch_in === 1) {
			console.log('打卡成功')
			return res.status(200).json({
				status: 200,
				message: '打卡成功',
				data: { results },
			})
		}
	})
}

/*
 * 添加用户
 * */
exports.addUser = (req, res) => {
	const { username, role, onBoardTime } = req.query
	let { cellPhone } = req.query

	/*
	 * 判空
	 * */
	if (!username || !cellPhone || !role || !onBoardTime) {
		return res.status(400).json({ status: 400, message: '必要值不能为空！' })
	}

	/*
	 * 类型转换
	 * */
	if (typeof cellPhone !== 'number') cellPhone = Number(cellPhone)
	if (typeof username !== 'string' || typeof cellPhone !== 'number' || typeof role !== 'string' || typeof onBoardTime !== 'string') {
		return res.status(400).json({ status: 400, message: '必要值类型错误！' })
	}

	/*
	 * 入库
	 * */
	const avatar = path.join(__dirname, '../../public/upload/default-avatar.svg')
	const insertUserSql = 'insert into user (username, cell_phone, role, on_board_time, user_avatar ) value (?,?,?,?,?)'
	db.query(insertUserSql, [username, cellPhone, role, onBoardTime, avatar], (err, results) => {
		if (err) return res.status(500).json({ status: 500, message: err.message })
		const queryUserInfo = 'select * from user where username=?'
		db.query(queryUserInfo, username, (errB, resultsB) => {
			if (errB) return res.status(500).json({ status: 500, message: err.message })
			// const {username ,role，onBoardTime}
			if (resultsB.length < 1) return res.status(500).json({ status: 500, message: '添加失败，请稍后重试' })
			console.log(resultsB[0])
			const { username, role, on_board_time, cell_phone, head_img } = resultsB[0]
			res.status(200).json({
				status: 200,
				data: { username, role, on_board_time, cell_phone, head_img },
			})
		})
	})
}

/*
 * 获取员工列表
 * */
exports.getUserList = (req, res) => {
	let { page, size } = req.query

	/*
	 * 判空
	 * */

	if (!page || !size) return res.status(400).json({ status: 400, message: '必要参数不能为空！' })

	/*
	 * 转换类型
	 * */

	if (typeof page !== 'number' || typeof size !== 'number') {
		page = parseInt(page)
		size = parseInt(size)
	}

	/*
	 * 获取
	 * */

	const getUserListTotal = () => {
		// 获取总条数
		return new Promise((resolve, reject) => {
			const userListTotalSql = 'select count(*) as total from user'
			db.query(userListTotalSql, (err, results) => {
				if (err) reject(err)
				else resolve(results)
			})
		})
	}
	const getUserListSize = () => {
		// 获取每页条数
		return new Promise((resolve, reject) => {
			const userListSizeSql = `select * from user limit ${size} offset ${(page - 1) * size}`
			db.query(userListSizeSql, (err, results) => {
				if (err) reject(err)
				else resolve(results)
			})
		})
	}

	/*
	 * 返回
	 * */

	Promise.all([getUserListTotal(), getUserListSize()])
		.then(async ([total, list]) => {
			total = total[0].total
			const filteredList = list.map((item, index) => {
				return {
					index: index + 1 + (page - 1) * size,
					id: item.id,
					username: item.username,
					headImg: item.head_img,
					onBoardTime: item.on_board_time,
					roles: [],
					cellPhone: item.cell_phone,
				}
			})

			// 创建一个 Promise 数组，用于存储每个查询操作的 Promise
			const promises = filteredList.map((item) => {
				return new Promise((resolve, reject) => {
					db.query('select * from roles where user_id = ?', [item.id], (err, results) => {
						if (err) {
							reject(err)
						} else {
							item.roles = results.map((role) => role.role)
							resolve()
						}
					})
				})
			})

			// 等待所有查询操作完成
			await Promise.all(promises)

			res.status(200).json({ status: 200, data: { list: filteredList, total, page, size } })
		})
		.catch((err) => {
			console.log(err)
		})
}
