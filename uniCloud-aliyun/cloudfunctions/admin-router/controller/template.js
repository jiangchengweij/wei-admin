const BaseController = require('../base/BaseController');

class XxxController extends BaseController {
	
	collection = 'goods-add';
	
	async index() {
		const { ctx, service } = this;
	}
}

module.exports = XxxController;
