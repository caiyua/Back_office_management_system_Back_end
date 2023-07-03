/*
 * 登录逻辑
 * 1. 判空
 *  - 2. 验证合法性
 * 3. 查用户是否存在 || 4. 查密码是否正确
 * 5. 返回token
 * */

const bcrypt = require('bcryptjs')
const db = require('../../config/db')
const jwt = require('jsonwebtoken')
const { jwtSecretKey } = require('../../config/jwtSecretKey')

exports.login = (req, res) => {
	const { username, password } = req.body
	// 判空
	if (!username || !password) {
		return res
			.status(400)
			.json({ status: 400, message: '用户名和密码不能为空' })
	}
	// 用户是否存在
	const isUserExistSql = 'select * from user where username=?'
	db.query(isUserExistSql, username, (err, results) => {
		if (err) {
			return res.status(500).json({ status: 500, message: err.message })
		}
		// 密码是否正确
		const isPassword = bcrypt.compareSync(password, results[0].password)
		if (!results.length > 0 || !isPassword) {
			return res
				.status(401)
				.json({ status: 401, message: '用户名或密码错误' })
		}
		// 返回token
		const user = { ...results[0] }
		delete user.password
		const tokenExpiration = 1000 * 60 * 20
		const token = jwt.sign(user, jwtSecretKey, {
			expiresIn: tokenExpiration,
		})
		res.status(200).json({
			status: 200,
			message: '登录成功',
			data: {
				token: 'Bearer ' + token,
				tokenExpiration,
				userinfo: user,
			},
		})
	})
}
