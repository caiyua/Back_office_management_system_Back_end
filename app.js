const express = require('express')
const app = express()

//region 解析中间件配置
const cors = require('cors')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// JWT相关
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
//endregion

// 路由
const userRouter = require('./router/user')
const registerRouter = require('./router/register')
const loginRouter = require('./router/login')
app.use('/api/v1', registerRouter)
app.use('/api/v1', loginRouter)
app.use('/api/v1/user', userRouter)

//region 错误中间件

const joi = require('joi')
app.use((err, req, res, next) => {
	// joi表单的用户信息校验失败
	if (err instanceof joi.ValidationError) {
		return res.send({ code: 1, message: err.message })
	}

	// 路由不存在（这行代码有问题，如果没有token或者token错误不会往下走执行，而是卡着这行，有机会再解决，）
	// res.status(404).json({ status: 404, message: '未找到该路由，请检查路径' })

	// 没有token或者token错误
	if (err.name === 'UnauthorizedError') {
		return res.status(401).json({ status: 401, message: 'token无效或过期' })
	}

	// 其他错误
	res.send({ code: 1, message: err.message })
})

//endregion

//region 监听服务器
const PORT = 3000
app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`)
})
//endregion
