const uniID = require('uni-id-common')
module.exports = () => {
	return async function auth(ctx, next) {
		const uniIDIns = uniID.createInstance({
			context: ctx.context
		})
		const authFun = async (throwErr = false) => {
			const payload = await uniIDIns.checkToken(ctx.event.uniIdToken)
			if(payload.errCode) {
				if(throwErr) {
					ctx.throw(payload.errCode, payload.message)
				} else {
					return null
				}
			}
		}
		ctx.auth = authFun
		next()
	}
}
