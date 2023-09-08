const middlewareAuth = require('./middleware/auth.js')
const middlewareCommon = require('./middleware/common.js')
const middlewareLogger = require('./middleware/logger.js')
const middlewarePermission = require('./middleware/permission.js')

module.exports = {
	middlewareAuth,
	middlewareCommon,
	middlewarePermission,
	middlewareLogger
}
