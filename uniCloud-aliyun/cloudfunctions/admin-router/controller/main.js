const Controller = require("uni-cloud-router").Controller;

class mainController extends Controller {

	async init() {
		const { db, ctx } = this
		const res = {}
		res.adminInfo = this.pick(
			ctx.currentUser,
			['username', 'nickname', 'last_login_date', 'role']
		)
		//超级用户
		if (ctx.currentUser.role.includes('admin')) {
			const adminMenusRes = await db.collection('opendb-admin-menus')
				.field({ name: true, icon: true, url: true, sort: true, parent_id: true, menu_id: true })
				.where({ enable: true })
				.orderBy('sort', 'asc')
				.get()
			res.menus = adminMenusRes.data
		} else {
			
		}
		//返回数据给客户端
		return res
	}
}

module.exports = mainController;
