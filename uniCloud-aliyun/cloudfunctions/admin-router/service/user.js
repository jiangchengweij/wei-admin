const BaseService = require("../base/BaseService.js");

const createConfig = require('uni-config-center')
const shareConfig = createConfig({ // 获取配置实例
    pluginId: 'admin-config' // common/uni-config-center下的插件配置目录名
})
const adminConfig = shareConfig.config() // 获取common/uni-config-center/share-config/config.json的内容

class UserService extends BaseService {

	async adminList(filter) {
		const { db } = this
		const where = {}
		const { total } = await db.collection('uni-id-users').where(where).count()
		const dbCmd = db.command
		const $ = dbCmd.aggregate
		const res = await db.collection('uni-id-users')
			.aggregate()
			.lookup({
				from: 'opendb-app-list',
				let: { 
					dcloud_appid: '$dcloud_appid'
				},
				pipeline: $.pipeline()
					.match(dbCmd.expr($.all(['$$dcloud_appid', ['$appid']])))
					.project({
						name: 1,
					})
					.done(),
				as: 'publishedBooks',
			}).end()
		return res
	}
	
	async addAdminUser(data) {
		const { db } = this
		return true
	}
}

module.exports = UserService
