// 处理路由不存在的中间件
function handleNotFound(req, res, next) {
	const error = new Error('Not Found')
	error.status = 404
	next(error)
}

// 处理404错误的中间件
function handle404Error(err, req, res, next) {
	if (err.status === 404) {
		return res.status(404).json({ status: 404, message: 'Not Found' })
	}
	next(err)
}

module.exports = {
	handleNotFound,
	handle404Error,
}
