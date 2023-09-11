const BaseService = require("../base/BaseService.js");
const { menuDb } = require('../constant/db.js')

class MenuService extends BaseService {
		
	async index(filter) {
		const { db, ctx } = this
		const { _, tree } = ctx.utils;
		const { data } = await db.collection(menuDb).get();
		const menuList = tree.listToTree(data);
		return { list: menuList }
	}
	
	async add(data) {
		const { db } = this
		const nowtime = Date.now()
		return await db.collection(menuDb).add({
			...data,
			updatetime: nowtime,
			createtime: nowtime
		})
	}
	
	async detail(params) {
		const { db, ctx } = this;
		const { data } = await db.collection(menuDb).where(params).get()
		if (!data || data.length === 0) {
			ctx.throw()
			return
		}
		return data[0]
	}
	
	async edit(params) {
		const { db, ctx } = this
		const { _ } = ctx.utils;
		const _id = params['_id']
		const obj = _.omit(params, ['_id', 'updatetime', 'createtime'])
		obj['updatetime'] = Date.now()
		const res = await db.collection(menuDb)
			.doc(_id)
			.update(obj)
		return res
	}

	async del(params) {
		console.log(params)
	}
	
	async sortable() {
		
	}
}

module.exports = MenuService
