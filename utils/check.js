/*
* 验证用户名和密码
* 目前很低级，用户名甚至可以注册数字
* */
const joi = require('joi')


const username = joi
	.string()
	.pattern(/^[\S]{3,8}$/)
	.required()
const password = joi
	.string()
	.pattern(/^[\S]{6,15}$/)
	.required()

exports.userCheck = {
	body: {
		username,
		password,
	},
}
