/*
 * 员工模块-逻辑
 * */

const db = require('../../config/db')

/*
 * 添加员工
 * */
exports.createEmployee = (req, res) => {
	const { username, cellPhone, roles } = req.body
	/*
	 * 判空
	 * */
	if (!username || !cellPhone || !roles) return res.status(400).json({ success: false, message: '姓名、手机号、角色不能为空' })

	res.status(200).json({ success: true, message: '收到' })
}
