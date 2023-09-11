const BaseController = require('../base/BaseController');

class HelloController extends BaseController {
	
	collection = 'goods-add'
	
	async index() {
		const { ctx, service } = this
		this.test()
	}
}

module.exports = HelloController;
