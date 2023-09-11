const Service = require("uni-cloud-router").Service;
const { ValidatorError } = require('../constant/code');

class BaseService extends Service {

	constructor(ctx) {
		super(ctx)
		this._ = ctx._;
	}

	_generateWhere(searchs = []) {
		const { ctx, db } = this
		const { _ } = ctx.utils
		const dbCmd = db.command;
		const where = {}
		for (searchItem of searchs) {
			
		}
		return where
	}
	
	_throw() {
		this.ctx.throw(ValidatorError, 'not found data')
	}
}

module.exports = BaseService;
