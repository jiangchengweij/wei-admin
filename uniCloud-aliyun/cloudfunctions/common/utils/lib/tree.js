const _ = require('./lodash')

/**
 * 数组转换为树结构
 * @param list
 * @param childrenKey
 * @param parentKey
 */
function listToTree(list, key = '_id', parentKey = 'pid') {
	let map = {},
		node,
		roots = [],
		i

	for (i = 0; i < list.length; i += 1) {
		map[list[i][key]] = i
		list[i].children = []
	}

	for (i = 0; i < list.length; i += 1) {
		node = list[i]
		if (node[parentKey] && node[parentKey] !== '0') {
			list[map[node[parentKey]]].children.push(node)
		} else {
			roots.push(node)
		}
	}
	return roots
}

const ICON = ['│', '├', '└'];

/**
* 将数组某个字段渲染为树状,需自备children children可通过$this->assembleChild()方法组装
* @param array  arr         要改为树状的数组
* @param string field       '树枝'字段
* @param int    level       递归数组层次,无需手动维护
* @param bool   superiorEnd 递归上一级树枝是否结束,无需手动维护
* @return array
*/
function getTreeArray(arr, field = 'name', level = 0, superiorEnd = false) 
{
	level++;
	let number = 1;
	let total = arr.length;
	let key;
	for (key in arr) {
		let prefix = (number === total) ? ICON[2] : ICON[1];
		if (level === 2) {
			arr[key][field] = ''.padStart(4) + prefix + arr[key][field]
		} else if (level >= 3) {
			arr[key][field] = ''.padStart(4) + (superiorEnd ? '' : ICON[0])
				+ ''.padStart((level - 2) * 4) + prefix + arr[key][field];
		}

		if (arr[key]['children'] && !_.isEmpty(arr[key]['children'])) {
			arr[key]['children'] = getTreeArray(arr[key]['children'], field, level, number === total)
		}
		number++;
	}
	return arr;
}

function assembleTree(data) {
	let arr = []
	let v;
	for (v of data) {
		let children = v['children'] || []
		arr.push(v)
		if (children) {
			arr = arr.concat(children)
		}
	}
	return arr
}

module.exports = {
	listToTree,
	assembleTree
}

