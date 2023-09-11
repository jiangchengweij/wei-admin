const BaseService = require("../base/BaseService.js");

class CrudService extends BaseService {
	
	async index(dbName, where) {
		const { db, ctx } = this
		const { _, tree } = ctx.utils;
		const { data } = await db.collection(dbName).get();
		return { list: data }
	}
	
	async add(dbName, data) {
		const { db } = this
		const nowtime = Date.now()
		return await db.collection(dbName).add({
			...data,
			updatetime: nowtime,
			createtime: nowtime
		})
	}
	
	async detail(dbName, params) {
		const { db, ctx } = this;
		const { data: list } = await db.collection(dbName).where(params).get()
		if (!data || data.length === 0) {
			ctx.throw()
			return
		}
		return data[0]
	}
	
	async edit(dbName, params) {
		const { db, ctx } = this
		const { _ } = ctx.utils;
		const _id = params['_id'];
		const obj = _.omit(params, ['_id', 'updatetime', 'createtime'])
		obj['updatetime'] = Date.now()
		const res = await db.collection(dbName)
			.doc(_id)
			.update(obj)
		return res
	}
	
	async del(dbName, params) {
		console.log(dbName)
	}
	
	async sortable(dbName, data) {
		
	}
}

module.exports = CrudService
