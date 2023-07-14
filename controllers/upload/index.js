/*
 * 上传文件模块-逻辑
 * */
const db = require('../../config/db')
const { USER_AVATAR, SERVER_URL, PORT } = require('../../config/constant')

/*
 * 用户头像
 * */
exports.upDateAvatar = (req, res) => {
	console.log('上传被请求了')
	console.log(req.file) // 打印上传的文件信息
	if (!req.file) {
		res.status(400).json({ success: true, message: '请上传头像' })
	}

	/*
	 * 入库
	 * */
	const headImgUrl = SERVER_URL + PORT + '/' + (USER_AVATAR + '/' + req.file.filename).split('public/')[1]
	console.log(headImgUrl)
	// db.query('insert into user (user_avatar) value (?)', [headImgUrl], (err, results) => {
	// 	console.log(results)
	// })
}
