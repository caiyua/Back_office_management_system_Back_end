const express = require('express')
const app = express()
const { handleNotFound, handle404Error } = require('./utils/notFoundMiddleware')

/*
 * 解析json、post、跨域
 * */
const cors = require('cors')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

/*
 * 静态资源（必须放在JWT认证前）
 **/
app.use(express.static(__dirname + '/public'))

/*
 * JWT
 * */
const expressJwt = require('express-jwt')
const { jwtSecretKey } = require('./config/jwtSecretKey')
const jwtWhiteList = ['/api/v1/register', '/api/v1/login']
app.use(
	expressJwt({
		secret: jwtSecretKey,
		algorithms: ['HS256'],
	}).unless({
		path: jwtWhiteList,
	})
)

/*
 * 路由
 * */
const userRouter = require('./router/user')
const registerRouter = require('./router/register')
const loginRouter = require('./router/login')
app.use('/api/v1', registerRouter)
app.use('/api/v1', loginRouter)
app.use('/api/v1/user', userRouter)

/*
 * 错误中间件
 * */
const joi = require('joi')
app.use((err, req, res, next) => {
	// 没有 token 或者 token 错误
	if (err.name === 'UnauthorizedError') {
		return res.status(401).json({ status: 401, message: '未收到token或无效、过期' })
	}

	// joi 表单的用户信息校验失败
	if (err instanceof joi.ValidationError) {
		return res.status(401).json({ status: 401, message: err.message })
	}

	res.status(500).json({ status: 500, message: '服务器错误' }) // 其他错误
})
app.use(handleNotFound) // 处理路由不存在的中间件
app.use(handle404Error) // 处理404错误的中间件

/*
 * 监听端口
 * */
const PORT = 3000
app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`)
})
