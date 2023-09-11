const Controller = require("uni-cloud-router").Controller;
const { ValidatorError } = require('../constant/code')

class BaseController extends Controller {

	constructor(ctx) {
		super(ctx);
		this._ = ctx._;
	}
	
	_vtError(err) {
		return {
			code: ValidatorError,
			data: '传递参数错误',
			detail: err
		}
	}

	_error(code, message) {
		return {
			code,
			message
		}
	}
	
	_success(data) {
		return {
			code: 0,
			data
		}
	}
}

module.exports = BaseController;
