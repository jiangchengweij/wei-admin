const BaseController = require('../base/BaseController');

class SystemController extends BaseController {

	async adminUserList() {
		const { service, ctx } = this
		const data = await service.user.adminList(ctx.data)
		return { data }
	}
}

module.exports = SystemController;
