const uniID = require('uni-id-common')

module.exports = (options) => {
	return async function premission(ctx, next) {
		const { db } = ctx; 
		const uniIDIns = uniID.createInstance({
			context: ctx.context
		})
		const payload = await uniIDIns.checkToken(ctx.event.uniIdToken)
		if(payload.errCode) {
			ctx.throw(payload.errCode, payload.message)
		}
		const { data } = await db.collection('uni-id-users').doc(payload.uid).get()
		if(!data || data.length == 0) {
			ctx.throw('????')
		}
		ctx.currentUser = data[0]
		if(!ctx.currentUser.role.includes('admin')) {
			
		}
		await next()
	}
}
