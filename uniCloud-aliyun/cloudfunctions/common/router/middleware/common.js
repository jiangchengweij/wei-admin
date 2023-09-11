const FAILED_CODE = 'INVOKE_FUNCTION_FAILED'
const utils = require('utils')

module.exports = (options) => {	
	return async function common(ctx, next) {
		ctx.utils = utils
		await next()
	}
}
