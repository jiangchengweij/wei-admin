const { middlewarePermission, middlewareCommon } = require('router')

module.exports = {
	debug: false, // 输出调试信息
	baseDir: __dirname, // 应用根目录
	middleware: [ // 中间件
		[ middlewareCommon() ],
		[ middlewarePermission({
				all: ['main'],
				guest: []
			})
		]
	]
}
