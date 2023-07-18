/*
 * 员工模块-逻辑
 * */

const db = require('../../config/db')

/*
 * 添加员工
 * */
exports.createEmployee = (req, res) => {
	console.log('添加员工被访问了')
	let { username, cellPhone, roles } = req.query

	/*
	 * 判空
	 * */
	if (!username || !cellPhone || !roles) return res.status(400).json({ success: false, message: '姓名、手机号、角色不能为空' })

	/*
	 * 转换类型
	 * */
	if (typeof roles === 'string') {
		roles = roles.split(',')
		if (typeof roles === 'string') return res.status(400).json({ success: false, message: 'roles必须是array类型' })
	}

	/*
	 * 入库
	 * */
	db.query('insert into user (username,cell_phone) values (?, ?)', [username, cellPhone], (err, userResult) => {
		if (err) return res.status(500).json({ success: false, message: '添加失败' })
		// 获取刚插入的用户id
		const userId = userResult.insertId
		if (roles.length > 0) {
			// 构建角色数据的二维数组
			const rolesValues = roles.map((role) => [userId, role])
			db.query('insert into roles (user_id, role) values ?', [rolesValues], (rolesErr, rolesResults) => {
				if (rolesErr) return res.status(500).json({ success: false, message: err.message })
				db.query('select * from user where id=?', [userId], (queryErr, queryRes) => {
					if (queryErr) return res.status(500).json({ success: false, message: err.message })
					const insertedEmployee = queryRes[0] // 假设查询结果是一个数组，取第一个元素即为插入的员工数据
					// 只返回 username、cellPhone、roles、abc
					let { username, cellPhone, on_board_time } = insertedEmployee
					db.query('select role from roles where user_id=?', [userId], (rolesQueryErr, rolesQueryRes) => {
						if (rolesQueryErr) return res.status(500).json({ success: false, message: rolesQueryErr.message })
						const roles = rolesQueryRes.map((row) => row.role)
						// 将角色信息添加到员工数据中
						const employeeData = { username, cellPhone, on_board_time, roles }
						res.status(200).json({ success: true, data: employeeData })
					})
				})
			})
		}
	})
}
