'use strict';
const uniID = require('uni-id-common')
const db = uniCloud.database()
const dbCmd = uniCloud.dbCmd
const adminMenusCt = db.collection('opendb-admin-menus')
const userInfoCt = db.collection('uni-id-users')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const uniIDIns = uniID.createInstance({ // 创建uni-id实例
		context: context,
	})
	const payload = await uniIDIns.checkToken(event.uniIdToken) // 后续使用uniIDIns调用相关接口
	if (payload.errCode) {
		return payload
	}
	const res = {}
	const userInfoRes = await userInfoCt
		.field({ username: true, nickname: true, last_login_date: true, role: true })
		.where({ '_id': payload.uid })
		.get()
	res.adminInfo = userInfoRes.data[0]
	//超级用户
	if (payload.role.includes('admin')) {
		const adminMenusRes = await adminMenusCt
			.field({ name: true, icon: true, url: true, sort: true, parent_id: true, menu_id: true })
			.where({ enable: true })
			.orderBy('sort', 'asc')
			.get()
		res.menus = adminMenusRes.data
	} else {
		
	}
	//返回数据给客户端
	return res
};
