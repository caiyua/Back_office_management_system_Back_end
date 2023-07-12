/*
 * 上传文件模块-逻辑
 * */
const db = require('../../config/db')

/*
 * 用户头像
 * */
exports.upDateAvatar = (req, res) => {
	console.log('上传被请求了')
	console.log(req.body)
	res.send(req.body)
}
