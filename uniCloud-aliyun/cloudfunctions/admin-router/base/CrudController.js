const BaseController = require('./BaseController');

class CrudController extends BaseController {
	
	constructor(ctx) {
		super(ctx);
	}
	
	async index() {
		const { ctx, service } = this;
		const res = await service.crud.index(this.dbName, ctx.data);
		return this._success(res)
	}
	
	async add() {
		const { ctx, service } = this;
		const res = await service.crud.add(this.dbName, ctx.data)
		return this._success(res)
	}
	
	async detail() {
		const { ctx, service } = this;
		const { _ } = ctx.utils;
		if (_.isEmpty(ctx.data)) {
			return this._vtError()
		}
		const row = await service.crud.detail(this.dbName, ctx.data)
		return this._success({ row })
	}
	
	async edit() {
		const { ctx, service } = this;
		const { _ } = ctx.utils;
		if (_.isEmpty(ctx.data)) {
			return this._vtError()
		}
		const res = await service.crud.edit(this.dbName, ctx.data)
		return this._success(res)
	}
	
	async del() {
		const { ctx, service } = this;
		const { _ } = ctx.utils;
		if (_.isEmpty(ctx.data)) {
			return this._vtError()
		}
		const res = await service.crud.edit(this.dbName, ctx.data)
		return this._success(res)
	}
}

module.exports = CrudController;
