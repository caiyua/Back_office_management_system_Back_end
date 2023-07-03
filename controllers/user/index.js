/*
 * 用户模块逻辑汇总
 * */
const jwt = require('jsonwebtoken')
const { jwtSecretKey } = require('../../config/jwtSecretKey')

// 查询用户自身信息逻辑
exports.queryUserinfo = (req, res) => {
	// 不需要向数据库发起请求，因为token里面存着请求用户的信息
	const token = req.headers.authorization
	const userinfo = jwt.verify(token.split('Bearer ')[1], jwtSecretKey) // 解析的时候也要把Bearer后面的空格加上
	res.status(200).json({
		status: 200,
		data: { username: userinfo.username, handImg: userinfo.head_img },
	})
}
