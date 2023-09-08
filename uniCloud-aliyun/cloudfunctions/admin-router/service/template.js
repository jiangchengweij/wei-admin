const BaseService = require("../base/BaseService.js");

class XxxService extends BaseService {
	async create(data) {
		return this.db.add(data);
	}
}

module.exports = XxxService
