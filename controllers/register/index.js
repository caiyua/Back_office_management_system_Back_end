/*
 * 注册逻辑
 * 1. 判空
 *  - 2. 验证合法性
 * 3. 查重
 * 4. 加密
 * 5. 入库
 * */

const db = require('../../config/db')
const bcrypt = require('bcryptjs')

exports.register = (req, res) => {
	const { username, password } = req.body
	if (!username || !password) {
		return res
			.status(400)
			.json({ status: 400, message: '用户名和密码不能为空' })
	}
	const queryRepeatSql = 'select * from user where username=?'
	db.query(queryRepeatSql, username, (err, results) => {
		if (err) {
			return res.status(500).json({ status: 500, message: err.message })
		}
		if (results.length > 0) {
			return res
				.status(401)
				.json({ status: 401, message: '用户名已存在' })
		}
		// 准备入库
		const encryptedPassword = bcrypt.hashSync(password, 10)
		const insertUserinfoSql =
			'insert into user (username, password, head_img) value(?,?,?)'
		const headImg = [
			'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/10.jpeg',
			'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/11.jpeg',
			'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/12.jpeg',
			'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/13.jpeg',
			'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/14.jpeg',
			'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/15.jpeg',
			'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/16.jpeg',
			'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/17.jpeg',
			'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/18.jpeg',
			'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/19.jpeg',
		]
		const num = Math.floor(Math.random() * 10) // 向下取整，返回0~9
		db.query(
			insertUserinfoSql,
			[username, encryptedPassword, headImg[num]],
			(err, results) => {
				if (err) {
					return res
						.status(500)
						.json({ status: 500, message: err.message })
				}
				// 添加成功后，立马返回此用户的信息
				const queryUserinfo = 'select * from user where username=?'
				db.query(queryUserinfo, username, (errD, resultsD) => {
					if (errD) {
						return res
							.status(500)
							.json({ status: 500, message: err.message })
					}
					delete resultsD[0].password
					res.status(200).json({ status: 200, data: resultsD[0] })
				})
			}
		)
	})
}
