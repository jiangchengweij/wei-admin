const FAILED_CODE = 'INVOKE_FUNCTION_FAILED'

module.exports = (options) => {	
	return async function common(ctx, next) {
		await next()
	}
}